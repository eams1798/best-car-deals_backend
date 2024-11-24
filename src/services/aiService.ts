import { Car } from '../interfaces';
import anthropic from '../utils/anthropicClient';

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export async function getCarAnalysis(car: Car) {
  const stream = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    messages: [{
      role: "user",
      content: `How reliable is this car on the market? Is it easy to repair? What future problems might it have? Give me a brief summary of NHTSA and customer reviews. ${JSON.stringify(car)}`,
    }],
    stream: true
  });

  return stream;
}

export async function getCarGeminiAnalysis(car: Car) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 512
    }
  });
  
  const prompt = `How reliable is this car on the market? Is it easy to repair? What future problems might it have? Give me a brief summary of customer reviews and where can I find more information about the car model? ${JSON.stringify(car)}`;
  
  const result = await model.generateContentStream(prompt);

  return result;
}