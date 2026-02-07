import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const message = (formData.get("message") as string) || "";

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No OCT image provided" },
        { status: 400 }
      );
    }

    // ---- Validate image ----
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

    // ---- Convert image to base64 ----
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    // ---- Gemini Vision Call (FREE) ----
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    message ||
                    `You are analyzing a retinal OCT B-scan image.

First, describe ONLY what you can directly see in the image.
Do not assume the scan is normal.
Do not give a diagnosis unless visible abnormalities are present.

Explicitly check for:
- Hyporeflective cystoid spaces
- Retinal thickening
- Subretinal fluid
- Irregular foveal contour
- Hyperreflective lesions

If abnormalities are present, describe them.
If none are visible, explicitly state that the scan appears normal.

Avoid generic medical statements.`,
                },
                {
                  inline_data: {
                    mime_type: image.type,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.05,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const data = await response.json();

    const analysis =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate analysis.";

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("OCT analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to analyze OCT scan. Please try again.",
      },
      { status: 500 }
    );
  }
}
