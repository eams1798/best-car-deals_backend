// Make sure to include these imports:
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 1024
    }
  });
  
  const prompt = "Explain how AI works.";
  
  const result = await model.generateContentStream(prompt);
  
  // Print text as it comes in.
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
};

