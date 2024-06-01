import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConversationType } from "./type";

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
