export const chatResponseSchema = {
  description:
    "This is your response to a user chat message which is of type chat",
  type: "array",
  items: {
    description: "This is a chunk of your text response",
    type: "object",
    properties: {
      title: {
        description:
          "Title of the current paragraph, title can be optional if not required",
        type: "string",
      },
      paragraphs: {
        description: "List of paragraphs related to title",
        type: "array",
        items: {
          description: "list of paragraphs related to title",
          type: "object",
          properties: {
            text: { description: "Paragraph text", type: "string" },
            codes: {
              description: "A list of codes line by line",
              type: "array",
              items: {
                description: "One line of code ",
                type: "object",
                properties: {
                  code: {
                    description: "one line of code for code",
                    type: "string",
                  },
                },
                required: ["code"],
              },
            },
            required: ["text"],
          },
        },
      },
    },
  },
};

export const flashcardSchema = {
  description:
    "Generate a flashcard based on document with a front and back, where the front is the question and the back is the answer to the question on the front, and also include a motivation message ",
  type: "object",
  required: ["message", "front", "back"],
  properties: {
    message: {
      type: "string",
      description:
        'A message containing some motivation for the user mixed with some emojis, an example would be, "Hey this is your flashcard, flip it to confirm your answer"',
    },
    front: {
      type: "string",
      description: "The front(Question) of the flash card",
    },
    back: {
      type: "string",
      description: "The back(Answer) to the question",
    },
  },
};

export const quizSchema = {
  type: "object",
  description:
    "A quiz object that has question, quiztype (which can either be multiple_choice or short_answer), answer, currentQuestion, totalQuestion, score",
  required: [
    "question",
    "answer",
    "options",
    "quiztype",
    "currentQuestion",
    "score",
    "totalQuestions",
    "message",
  ],
  properties: {
    message: {
      type: "string",
      description:
        "Some motivation message as my study partner with a twist of fun and goofiness",
    },
    question: { type: "string" },
    answer: { type: "string" },
    currentQuestion: { type: "number" },
    totalQuestions: { type: "number" },
    score: { type: "number" },
    options: {
      description:
        "four options with only one being the right answer to the quiz question, always make sure to shuffle the options so the answer would be in different position each time",
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};
