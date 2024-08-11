export const chatResponseSchema = {
  description: "Your response to user request in a list",
  type: "array",
  items: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["heading", "paragraph", "table", "code", "link"],
      },
      level: {
        type: "number",
        minimum: 1,
        maximum: 6,
        description: "Heading level (required for heading)",
      },
      text: {
        type: "string",
        description: "Text content (required for paragraph, heading, link)",
      },
      language: {
        type: "string",
        description: "Code language (required for code blocks)",
      },
      code: {
        type: "string",
        description: "Code snippet (required for code blocks)",
      },

      headers: {
        type: "array",
        items: { type: "string" },
        description: "Table headers (required for tables)",
      },
      title: {
        type: "string",
        description: "Table title (required for tables)",
      },
      rows: {
        type: "array",
        items: {
          type: "array",
          items: { type: "string" },
        },
        description: "Table rows (required for tables)",
      },
      href: {
        type: "string",
        description: "Link URL (required for links)",
      },
    },
    required: ["type"],
    allof: [
      {
        if: {
          properties: { type: { const: "heading" } },
        },
        then: {
          required: ["level", "text"],
        },
      },
      {
        if: {
          properties: { type: { const: "paragraph" } },
        },
        then: {
          required: ["text"],
        },
      },
      {
        if: {
          properties: { type: { const: "code" } },
        },
        then: {
          required: ["language", "code"],
        },
      },
      {
        if: { properties: { type: { const: "table" } } },
        then: { required: ["headers", "rows", "title"] },
      },
      {
        if: {
          properties: { type: { const: "link" } },
        },
        then: {
          required: ["href", "text"],
        },
      },
    ],
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
  description: "A quiz object that has 10 questions, and a motivation message",
  required: ["questions", "message", "difficulty"],

  properties: {
    difficulty: { type: "string", description: "Difficulty level of the quiz" },
    message: {
      type: "string",
      description:
        "Some motivation message as my study partner with a twist of fun and goofiness",
    },
    questions: {
      type: "array",
      description: "10 quiz questions in an array ",
      items: {
        type: "object",
        properties: {
          quiztype: {
            type: "string",
            description:
              "type of quiz question which can either be multiple_choice or short_answer",
          },
          question: { type: "string", description: "Question" },
          answer: { type: "string" },
          options: {
            description:
              "four options with only one being the right answer to the quiz question, always make sure to shuffle the options so the answer would be in different position each time",
            type: "array",
            items: {
              type: "string",
            },
          },
          required: ["answer", "options", "quiztype"],
        },
      },
    },
  },
};

export const insightSchema = {
  description:
    "How well user has done during the studying session and quiz session",
  type: "object",
  properties: {
    message: {
      type: "string",
      description:
        "Some message breaking how well i did in the session, response is formatted in markdown",
    },
    breakdowns: {
      type: "array",
      description:
        "This is a list of all the topics breakdown how well i did in the session tailored to each topic",
      items: {
        type: "object",
        properties: {
          topic: { type: "string", description: "a Topic during the session" },
          understanding: {
            type: "number",
            description: "how well i did on this topic on a scale of 1 - 100",
          },
        },
      },
    },
  },
};

export const noteSchema = {
  type: "array",
  description: "List of notes generated by you",
  items: {
    type: "object",
    properties: {
      topic: { description: "Topic the note is related to", type: "string" },
      type: { type: "string" },
      content: { description: "Body of the note", type: "string" },
    },
  },
};

export const checkShortanswerResponse = {
  type: "object",
  description:
    "A response message that provides user with feedback, remeber to focus more on understanding than being right, response is formatted in markdown",
  properties: {
    message: { type: "string", description: "message" },
  },
};


export const  downloadQuiz = {
  type: "array",
  description: "list of questions for user to download",
  items: {
    type: "object",
    properties: {
      question: { type: "string"},
      answer: { type: "string"}
    }
  }
}
