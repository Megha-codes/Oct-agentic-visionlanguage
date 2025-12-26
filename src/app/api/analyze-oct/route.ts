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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
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
                    `Analyze this OCT scan carefully.

Focus on:
- Retinal thickness
- Hyporeflective cystoid spaces
- Intraretinal or subretinal fluid
- Foveal contour changes
- Layer distortion

Describe visible findings objectively.
Do not include medical disclaimers.
Do not say everything is normal unless clearly visible.`,
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
            temperature: 0.2,
            maxOutputTokens: 1200,
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
