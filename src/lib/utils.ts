import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ConversationType,
  ImageDataType,
  MessageType,
  QuizType,
  senderType,
} from "./type";
import { FileDataPart, InlineDataPart, TextPart } from "@google/generative-ai";
import { geminiDocumentInitInstruction } from "./gemini_interactons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jsonDecode = (encodedJson: string) => {
  return JSON.parse(encodedJson);
};

export function createConversationObject(
  type: MessageType,
  sender: senderType,
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

export function processImage(imageData: ImageDataType) {
  const { base_64_data, img_type } = imageData;
  const mimetype = `image/${img_type}`;
  const imagePart: InlineDataPart = {
    inlineData: {
      mimeType: mimetype,
      data: base_64_data,
    },
  };
  return imagePart;
}

// const createDataURI = (base64String: string, mimetype: string) => {
//   return `data:${mimetype};base64,${base64String}`;
// };
