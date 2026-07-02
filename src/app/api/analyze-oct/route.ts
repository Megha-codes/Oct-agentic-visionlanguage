import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const INFERENCE_URL = process.env.INFERENCE_URL || "http://127.0.0.1:8001";
// NOTE: gemini-1.5-flash has been retired by Google (returns 404 on
// generateContent). Default to a current flash model; override via GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const DISCLAIMER = "Research pilot — not for clinical use";

// Display labels for each task key returned by the inference service.
const TASK_LABELS: Record<string, string> = {
  vri: "Vitreoretinal Interface",
  foveal: "Foveal Contour",
  architecture: "Retinal Architecture",
  rpe: "RPE / Choriocapillaris",
};

interface Finding {
  task: string;
  prediction: string;
  confidence: number;
  uncertain: boolean;
  caveat: string | null;
  all_probs?: Record<string, number>;
  // tolerated if the service ever includes it:
  task_label?: string;
}

function labelFor(f: Finding): string {
  return TASK_LABELS[f.task] || f.task_label || f.task;
}

function buildGroundingPrompt(findings: Finding[], userMessage: string): string {
  const lines = findings.map((f) => {
    const pct = Math.round(f.confidence * 100);
    const flags = [
      f.uncertain ? "UNCERTAIN" : null,
      f.caveat ? `caveat: ${f.caveat}` : null,
    ]
      .filter(Boolean)
      .join("; ");
    return `- ${labelFor(f)} (${f.task}): ${f.prediction} — confidence ${pct}%${
      flags ? ` [${flags}]` : ""
    }`;
  });

  return `You are assisting an ophthalmologist by writing a concise OCT B-scan
summary. A validated multi-task model produced these structured findings:

${lines.join("\n")}

Write a short, professional report (4-8 sentences) that:
- Summarizes the findings in clinical language, grounded ONLY in the list above.
- Does NOT invent measurements, diagnoses, or observations not implied by the findings.
- Explicitly notes any finding flagged UNCERTAIN and treats it cautiously.
- Includes any stated caveat verbatim in your reasoning.
- Ends with a one-line reminder that this is decision support, not a diagnosis.
${userMessage ? `\nClinician's question/context: ${userMessage}` : ""}`;
}

function fallbackReport(findings: Finding[]): string {
  const parts = findings.map((f) => {
    const pct = Math.round(f.confidence * 100);
    const unc = f.uncertain ? " (uncertain)" : "";
    const cav = f.caveat ? ` Note: ${f.caveat}` : "";
    return `${labelFor(f)}: ${f.prediction} — ${pct}% confidence${unc}.${cav}`;
  });
  return (
    "Automated summary (language model unavailable):\n" +
    parts.join("\n") +
    "\n\nThis is decision support, not a diagnosis."
  );
}

async function generateReport(
  findings: Finding[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallbackReport(findings);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: buildGroundingPrompt(findings, userMessage) }] },
          ],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
        }),
      }
    );

    if (!response.ok) return fallbackReport(findings);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || fallbackReport(findings);
  } catch {
    return fallbackReport(findings);
  }
}

// Lightweight status probe for the UI: is the inference service reachable and
// has it finished loading the model? Never throws.
export async function GET() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${INFERENCE_URL}/health`, {
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json({ online: false, status: `http_${res.status}` });
    }
    const data = await res.json().catch(() => ({}));
    // /health reports "ok" once weights are loaded, "loading" while starting.
    return NextResponse.json({ online: data?.status === "ok", detail: data });
  } catch {
    return NextResponse.json({ online: false, status: "unreachable" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const message = (formData.get("message") as string) || "";

    // ---- Validate image (unchanged contract) ----
    if (!image) {
      return NextResponse.json(
        { success: false, error: "No OCT image provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported image format" },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image too large (max 10MB)" },
        { status: 400 }
      );
    }

    // ---- 1. Run the model via the local inference service ----
    let findings: Finding[];
    try {
      const upstream = new FormData();
      upstream.append("file", image, image.name || "scan.png");

      const infRes = await fetch(`${INFERENCE_URL}/analyze`, {
        method: "POST",
        body: upstream,
      });

      if (!infRes.ok) {
        const detail = await infRes.text().catch(() => "");
        return NextResponse.json(
          {
            success: false,
            error: `Inference service error (${infRes.status})`,
            detail,
          },
          { status: 502 }
        );
      }

      const infData = await infRes.json();
      findings = infData.findings as Finding[];
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not reach the OCT inference service. Is it running on " +
            `${INFERENCE_URL}?`,
        },
        { status: 502 }
      );
    }

    // ---- 2. Ground the LLM on the structured findings (not the image) ----
    const report = await generateReport(findings, message);

    // ---- 3. Structured response ----
    return NextResponse.json({
      success: true,
      findings,
      report,
      disclaimer: DISCLAIMER,
    });
  } catch (error: any) {
    console.error("OCT analysis error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to analyze OCT scan." },
      { status: 500 }
    );
  }
}
