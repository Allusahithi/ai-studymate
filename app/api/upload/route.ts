import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (error: any) => {
        reject(error);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        const pages = pdfData.Pages || [];

        const extractedText = pages
          .map((page: any) =>
            (page.Texts || [])
              .map((text: any) => {
                try {
                  return decodeURIComponent(text.R[0].T);
                } catch {
                  return text.R[0].T;
                }
              })
              .join(" ")
          )
          .join("\n");

        resolve(extractedText);
      });

      pdfParser.parseBuffer(buffer);
    });

    return NextResponse.json({
      success: true,
      filename: file.name,
      text,
    });
  } catch (error) {
    console.error("PDF processing error:", error);

    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}