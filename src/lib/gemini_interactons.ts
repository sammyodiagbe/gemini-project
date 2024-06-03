export const generateInitialPossibleInteractions = (
  articleText: string
): string => {
  return `Hey Gemini, 
    Analyze the text and generate 4 possible interactions a user might want to have with ypu in regards to the text article below
    If the text has no clarity or direction you can ignore and just send a message back letting the user know their isn't clarity you could also add an entry in your response that sets clarity: false.( this is also at the root of the json object) The structure of each interaction object should always be { text: "..."} and also keep them at a shorter length please.

    Here is another thing to note, not all text given to you are for education purpose, some could be resumes, cover letters, you need to detect and create appropriate possible interactions, i believe in you

    Also add a field in the root of your response that type of article. It is up to you to determine if this is a school work, an article, a resume, a cover letter etc.

    An example of interactions would be, let say i send you an article on microplasticity, interactions I as a user would want to have with the article might be Summarize the text, Point out key note, create notes based on text, How does MicroPlasticity affect our enviroment

    text=${articleText}`;
};

export const geminiDocumentInitInstruction = (text: string): string => {
  return `
    The user has sent in extracted text from  a pdf I have given you the text below, So your conversation with user is going to be in relation to what(Text) the text is about, you are goin to help the user with every question or help they need. The extracted text has been passed below

    Whenever you are asked about the text provided your response should never mention text it should be more professionall and say maybe something like article, pdf, document, you come up with something awesome

    Now if the message from the user is unrelated to the text below you can ask them to try to keep questions related to the text or ask them if they wanna talk about the new question.

    for the structure of the response you send back it should always be 
    and you should include sources in the response if the user ask for that,
    you should also include a seperate entry called text if the user ask you to do some article or essay writting , you response are short like 'Yes i can definitely do that' then you actions lets say writing the article should be in the text entry of the json response
    {response: ".....", sources: [...], text:"", type: 'chat' },

    Always include sources anytime possible
    And always go straight to action for example if a user ask you to summarize all of some points in the document, don't ask questions just do

    If the user ask you anything related to quiz or flashcard, Tell them they can start a quiz or flashcard by clicking on the quiz|flashcard(you can only use one of this options depending on if the user asked for a quiz or a flashcard) button below

    This is the text to build your responses on
    Text=${text}
    `;
};

export const generateQuizGemini = (text: string): string => {
  return `
    Generate 10 quiz questions based on the text document
    now you should only send one question at a time
    you response should include the quiz which is an object like quiz: { question: "...", options: [...]:, answer: "..."}
    remember the answer has to be an option

    include a question object in your response and it should contain the question data

    After recieving this instruction, send the first question right away and also keep track of the user score point. each correct quiz answered is 10 points
  `;
};
