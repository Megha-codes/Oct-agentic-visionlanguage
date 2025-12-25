import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * IMPORTANT:
 * - Force Node.js runtime (required for Buffer & base64)
 * - Do NOT use Edge runtime here
 */
export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // -------- Parse form data --------
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const message = (formData.get("message") as string) || "";

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No OCT image provided" },
        { status: 400 }
      );
    }

    // -------- Validate image --------
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported image format" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image too large (max 10MB)" },
        { status: 400 }
      );
    }

    // -------- Convert image to base64 --------
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = buffer.toString("base64");

    // -------- OpenAI Vision Request --------
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are OCTina, an AI assistant specialized in Optical Coherence Tomography (OCT). " +
            "Analyze OCT scans and explain retinal findings clearly using ophthalmology terminology. " +
            "Do NOT provide a definitive diagnosis. " +
            "Always include a medical disclaimer stating that this is an AI-generated educational explanation.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                message ||
                "Please analyze this OCT scan and explain the retinal findings.",
            },
            {
              type: "input_image",
              image_url: `data:${image.type};base64,${base64Image}`,
              detail: "high", // REQUIRED by OpenAI SDK
            },
          ],
        },
      ],
      max_output_tokens: 1200,
    });

    // -------- Return response --------
    return NextResponse.json({
      success: true,
      analysis: response.output_text,
    });
  } catch (error) {
    console.error("OCT analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze OCT scan. Please try again.",
      },
      { status: 500 }
    );
  }
}
