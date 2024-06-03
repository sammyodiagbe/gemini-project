import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConversationType } from "./type";
import { TextPart } from "@google/generative-ai";
import { geminiDocumentInitInstruction } from "./gemini_interactons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jsonDecode = (encodedJson: string) => {
  return JSON.parse(encodedJson);
};

export function createConversationObject(
  type: string,
  sender: string,
  message: string
): ConversationType {
  return { type, sender, message };
}

export function processText(text: string): TextPart {
  const initialText: TextPart = {
    text: geminiDocumentInitInstruction(text!),
  };

  return initialText;
}
