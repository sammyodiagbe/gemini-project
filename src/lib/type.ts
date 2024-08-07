export type MessageType = "chat" | "quiz" | "flashcard" | "error" | "insights";
export type senderType = "ai" | "user" | "system";

type TopicBreakdownType = {
  topic: string;
  understanding: number;
  explanation: string;
};

export type MessageTypeObj = {
  title?: string;
  paragraphs: {
    text: string;
    codes: {
      code: string;
    }[];
  }[];
};

export type NoteType = {
  topic?: string;
  content: string;
  type?: string;
};
export type InsightType = {
  overall_understanding: string;
  breakdowns: TopicBreakdownType[];
};

export type ConversationType = {
  type: MessageType;
  message: string;
  sender: senderType;
  quiz?: QuizQuestionType[];
  flashcard?: FlashCardType;
  retryQuery?: string;
  insights?: InsightType;
  errorOrigin?: string;
  time?: number;
};

export type FlashCardType = {
  front: string;
  back: string;
};

export type QuizType = {
  question: string;
  options: string[];
  answer: string;
  quiztype: "multiple_choice" | "shortanswer";
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

export type ToastType = {
  title: string;
  body: string;
  type: "error" | "success" | "warning";
};

export type ImageDataType = {
  img_type: string;
  base_64_data: string;
};

export type QuizQuestionType = {
  question: string;
  answer: string;
  quiztype: "short_answer" | "multiple_choice";
  options?: string[];
};

export type QuizSessionType = {
  questions: QuizQuestionType[];
  message: string;
  difficulty: string;
};

export type QuizResponseType = {
  question: string;
  userAnswer: string;
  answer: string;
};

export type MessageItemType = {
  text?: string;
  type: "paragraph" | "code" | "heading" | "link" | "code" | "table";
  headers?: string[];
  rows?: string[][];
  language?: string;
  code?: string;
  href?: string;
  level?: number;
  title?: string;
};
