import { GoogleGenAI } from "@google/genai";
import { Review } from "../types";

// Initialize Gemini
// Note: In a production environment, never expose keys on the client side.
// This is for demonstration purposes as requested by the persona guidance.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const summarizeReviews = async (professorName: string, reviews: Review[]): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Unable to generate summary.";
  }

  if (reviews.length === 0) {
    return "No reviews available to summarize.";
  }

  const comments = reviews.map(r => `- "${r.comment}"`).join("\n");
  
  const prompt = `
    You are an assistant for a student feedback system called 'Rate My Professor'.
    Please analyze the following reviews for Professor ${professorName} and provide a concise, 3-sentence summary highlighting their main strengths and weaknesses based on student feedback.
    
    Reviews:
    ${comments}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary due to an error.";
  }
};

export const summarizeCourseReviews = async (courseName: string, courseCode: string, reviews: Review[]): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Unable to generate summary.";
  }

  if (reviews.length === 0) {
    return "No reviews available to summarize.";
  }

  const comments = reviews.map(r => `- "${r.comment}"`).join("\n");
  
  const prompt = `
    You are an assistant for a student feedback system called 'Rate My Professor'.
    Please analyze the following reviews for the course "${courseName}" (${courseCode}) and provide a concise, 3-sentence summary highlighting the general difficulty, content quality, and student sentiment regarding the course structure.
    
    Reviews:
    ${comments}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Error generating course summary:", error);
    return "Failed to generate summary due to an error.";
  }
};