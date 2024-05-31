import { GoogleGenerativeAI } from "@google/generative-ai";
const AI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY as string
);

export const Gemini = AI.getGenerativeModel(
  {
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  },
  {}
);
