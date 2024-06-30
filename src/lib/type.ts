export type MessageType = "chat" | "quiz" | "flashcard" | "error" | "insights";
export type senderType = "ai" | "user" | "system";

type TopicBreakdownType = {
  topic: string;
  understanding: number;
  explanation: string;
};

export type NoteType = {
  topic?: string;
  content: string;
  type?: string;
};
export type InsightType = {
  overall_understanding: string;
  recommended_topics: string[];
  understanding_breakdowns: TopicBreakdownType[];
};

export type ConversationType = {
  type: MessageType;
  message: string;
  sender: senderType;
  quiz?: QuizType;
  flashcard?: FlashCardType;
  retryQuery?: string;
  insights?: InsightType;
  errorOrigin?: string;
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
  currentQuestion: number;
  totalQuestions: number;
  score: number;
};

export type GeminiResponseType = {
  sources?: string[];
  type?: MessageType;
  response: string;
  quiz?: QuizType;
  text?: string;
};
