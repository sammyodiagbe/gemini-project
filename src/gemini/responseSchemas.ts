export const chatResponseSchema = {
  description:
    "This is your response to a user chat message which is of type chat",
  type: "array",
  items: {
    description: "This is a chunk of your text response",
    type: "object",
    properties: {
      title: {
        description: "Title of the current paragraph",
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
