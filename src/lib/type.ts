export type MessageType = "chat" | "quiz" | "flashcard" | "error";
type senderType = "ai" | "user" | "system";

export type ConversationType = {
  type: MessageType;
  message: string;
  sender: senderType;
  quiz?: QuizType;
  flashcard?: FlashCardType;
  retryQuery?: string;
};

export type FlashCardType = {
  front: string;
  back: string;
};

export type QuizType = {
  question: string;
  options: string[];
  answer: string;
  quiztype: "multiplechoice" | "shortanswer";
};

export type GeminiResponseType = {
  sources?: string[];
  type?: MessageType;
  response: string;
  quiz?: QuizType;
  text?: string;
};
