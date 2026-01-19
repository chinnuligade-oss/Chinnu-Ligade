
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (summary: any) => {
  try {
    const prompt = `
      Act as a high-end financial advisor. I will provide you with a summary of my financial data for the past 60 days.
      Data: ${JSON.stringify(summary)}
      
      Please provide:
      1. A short analysis of my spending habits.
      2. One specific tip to save more money based on the data.
      3. A motivational sentence to keep me on track.
      
      Keep the response concise and friendly (max 150 words). Format in plain text or simple markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I couldn't generate advice right now. Keep up the good work!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Advisor is currently unavailable. Please check your budget manually.";
  }
};
