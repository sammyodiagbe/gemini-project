import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jsonDecode = (encodedJson: string) => {
  return JSON.parse(encodedJson);
};
