export type MessageType = "chat" | "quiz" | "flashcard";

export type ConversationType = {
  type: MessageType;
  message: string;
  sender: string;
  quiz?: QuizType;
};

export type QuizType = {
  question: string;
  options: string[];
  answer: string;
};

export type GeminiResponseType = {
  sources?: string[];
  type: MessageType;
  response: string;
  quiz?: QuizType;
  text?: string;
};
