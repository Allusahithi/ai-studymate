import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { retrieveRelevantChunks } from "@/lib/rag";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const message = formData.get("message") as string;
    const documentsText = formData.get("documents") as string;
    const image = formData.get("image") as File | null;

    const documents = documentsText
      ? JSON.parse(documentsText)
      : [];

    // Get text chunks from uploaded study material
    const chunks = documents.map(
      (doc: { fileName: string; chunk: string }) => doc.chunk
    );

    // Retrieve relevant PDF information
    const relevantChunks = retrieveRelevantChunks(
      message || "",
      chunks,
      4
    );

    const context =
      relevantChunks.length > 0
        ? relevantChunks.join("\n\n---\n\n")
        : "No relevant information was found in the uploaded document.";

    // Prepare AI content
    const content: any[] = [];

    if (message) {
      content.push({
        type: "text",
        text: message,
      });
    }

    // Add image if provided
    if (image) {
      const imageBuffer = await image.arrayBuffer();

      const base64Image = Buffer.from(imageBuffer).toString(
        "base64"
      );

      content.push({
        type: "image",
        image: base64Image,
        mimeType: image.type,
      });
    }

    const result = await generateText({
      model: groq("qwen/qwen3.8-27b"),

      system: `You are AI StudyMate, an educational AI assistant.

You can answer questions using:
1. Uploaded study material.
2. Images provided by the student.
3. General knowledge when appropriate.

Retrieved study material:

${context}

Rules:
1. Give clear and simple explanations.
2. Use the uploaded study material when relevant.
3. If an image is provided, carefully analyze the image.
4. Do not invent information from the uploaded document.
5. If the answer is not present in the document, clearly say that it was not found in the uploaded material.
6. You may use general knowledge for questions not related to the document.
7. If the user asks about an image, describe and explain what is visible in it.
`,

      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    return Response.json({
      reply: result.text,
    });

  } catch (error) {
    console.error("Chat error:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}