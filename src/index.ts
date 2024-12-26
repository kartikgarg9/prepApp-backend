import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Middleware
app.use(express.json());
app.use(cors());


// API Endpoint for Chatbox
app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, context } = req.body;

    if (!question || !context) {
      res.status(400).json({ error: "Question and context are required" });
      return;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Context: ${context}\nQuestion: ${question}` },
      ],
      max_tokens: 150,
    });

    const answer = response.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      res.status(500).json({ error: "Failed to generate an answer." });
      return;
    }

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
