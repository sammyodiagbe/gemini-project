import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ConversationType,
  ImageDataType,
  MessageType,
  QuizType,
  senderType,
} from "./type";
import { InlineDataPart, TextPart } from "@google/generative-ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jsonDecode = (encodedJson: string) => {
  return JSON.parse(encodedJson);
};

export const jsonEncode = (data: any) => {
  return JSON.stringify(data);
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

export function processText(index: number, text: string): TextPart {
  const initialText: TextPart = {
    text: `page(${index + 1}):  ${text}`,
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

export const focusInstruction = (focusTopics: string[]) => {
  const init =
    "if asked what topics the focus is on just respond listing out the topics, there is no need to define the topics, quizes and flashcards are based off of this focus topics too";
  return focusTopics.length
    ? `Topics to focus on are ${focusTopics.join(", ")}, ${init},`
    : `Focus on all document, responses should be based off of the entire document, ${init}`;
};
// const createDataURI = (base64String: string, mimetype: string) => {
//   return `data:${mimetype};base64,${base64String}`;
// };

// export const filePart = (fileurl: string) => {
//   return F
// }
