"use client";

import { useState } from "react";

type DocumentChunk = {
  fileName: string;
  chunk: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentChunk[]>([]);
  const [image, setImage] = useState<File | null>(null);

    async function uploadFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      const newChunks = (data.text || "")
        .split(/\n+/)
        .filter((chunk: string) => chunk.trim().length > 0)
        .map((chunk: string) => ({
          fileName: data.filename,
          chunk,
        }));

      setDocuments((previous) => [
        ...previous,
        ...newChunks,
      ]);

      alert(
        `${data.filename} uploaded successfully!`
      );

    } catch (error) {
      console.error(error);
      alert("Upload failed.");

    } finally {
      setUploading(false);
    }
  }

async function sendMessage() {
  if (!message.trim() && !image) return;

  setLoading(true);
  setReply("");

  try {
    const formData = new FormData();

    formData.append("message", message);
    formData.append("documents", JSON.stringify(documents));

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      setReply("Error: " + data.error);
    } else {
      setReply(data.reply);
    }
  } catch (error) {
    console.error(error);
    setReply("Something went wrong.");
  }

  setLoading(false);
}
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            🤖 AI StudyMate
          </h1>

          <p className="text-slate-400 mt-2">
            Multimodal RAG Learning Assistant
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Upload Study Material
            </label>

            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={uploadFile}
              disabled={uploading}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm"
            />

            {uploading && (
              <p className="text-blue-400 text-sm mt-2">
                Processing document...
              </p>
            )}

            {documents.length > 0 && (
              <p className="text-green-400 text-sm mt-2">
                📚 {documents.length} document chunks loaded
              </p>
            )}
          </div>

          {/* AI Response */}
          <div className="bg-slate-800 rounded-xl p-5 min-h-[250px]">

            {!reply && !loading && (
              <p className="text-slate-400">
                Upload your study material and ask a
                question.
              </p>
            )}

            {loading && (
              <p className="text-slate-400">
                Thinking...
              </p>
            )}
            {/* Image Upload */}
<div className="mt-4">
  <label className="block text-sm font-semibold mb-2">
    Ask with an Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0] || null;
      setImage(file);
    }}
    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm"
  />

  {image && (
    <p className="text-green-400 text-sm mt-2">
      🖼️ {image.name} selected
    </p>
  )}
</div>

            {reply && (
              <div>
                <p className="text-sm text-blue-400 mb-2">
                  AI StudyMate
                </p>

                <p className="whitespace-pre-wrap">
                  {reply}
                </p>
              </div>
            )}
          </div>

          {/* Question Input */}
          <div className="flex gap-3 mt-5">

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask something..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "..." : "Send"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}