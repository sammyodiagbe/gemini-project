import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConversationType, MessageType, QuizType } from "./type";
import { TextPart } from "@google/generative-ai";
import { geminiDocumentInitInstruction } from "./gemini_interactons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jsonDecode = (encodedJson: string) => {
  return JSON.parse(encodedJson);
};

export function createConversationObject(
  type: MessageType,
  sender: string,
  message: string,
  quiz?: QuizType
): ConversationType {
  return { type, sender, message, quiz };
}

export const buttonIconSize = 15;

export function processText(text: string): TextPart {
  const initialText: TextPart = {
    text: geminiDocumentInitInstruction(text!),
  };

  return initialText;
}
