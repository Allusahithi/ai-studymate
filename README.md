# 🤖 AI StudyMate

AI StudyMate is a multimodal AI-powered study assistant that helps students understand their study materials using **Retrieval-Augmented Generation (RAG)**.

Users can upload study material, ask questions using text, and provide images for AI-powered analysis.

## 🚀 Live Demo

https://ai-studymate-three.vercel.app

## 📂 GitHub Repository

https://github.com/Allusahithi/ai-studymate

---

## ✨ Features

- 📄 Upload study materials
- 💬 Ask questions using natural language
- 🖼️ Support image-based questions
- 🔎 Retrieval-Augmented Generation (RAG)
- 🧠 Context-aware answers based on uploaded study material
- ⚡ Fast AI responses using Groq
- 🌐 Deployed using Vercel
- 📱 Simple and responsive user interface

---

## 🧠 How It Works

AI StudyMate uses a RAG-based approach to answer questions from uploaded study material.

### Step 1 — Upload Study Material

The user uploads a study document such as a PDF.

### Step 2 — Extract Text

The application extracts the text from the uploaded document and divides it into smaller chunks.

### Step 3 — Retrieve Relevant Content

When the user asks a question, the application compares the question with the available document chunks and retrieves the most relevant content.

### Step 4 — Generate the Answer

The retrieved context is provided to the AI model along with the user's question.

The AI then generates an answer based on the retrieved study material.

### Image Queries

Users can also upload an image along with their question. The multimodal AI model processes the image and generates a response.

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Vercel AI SDK**
- **Groq API**
- **pdf2json**
- **Tailwind CSS**
- **Vercel**

---

## 📁 Project Structure

```text
ai-studymate/
│
├── app/
│   ├── api/
│   ├── page.tsx
│   └── ...
│
├── components/
│   └── ...
│
├── lib/
│   └── rag.ts
│
├── public/
│
├── package.json
├── README.md
├── .gitignore
└── ...
