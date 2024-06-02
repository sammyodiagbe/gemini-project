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
    Please make sure your text contents are written in Markdown
    Also make sure to format the text properly adding doulbe newlines after headings and also after each paragraph(this is a very important instruction)
    The user has sent in extracted text from  a pdf I have given you the text below, So your conversation with user is going to be in relation to what(Text) the text is about, you are goin to help the user with every question or help they need. The extracted text has been passed below

    Whenever you are asked about the text provided your response should never mention text it should be more professionall and say maybe something like article, pdf, document, you come up with something awesome

    Now if the message from the user is unrelated to the text below you can ask them to try to keep questions related to the text or ask them if they wanna talk about the new question.

    for the structure of the response you send back it should always be 
    and you should include sources in the response if the user ask for that,
    you should also include a seperate entry called text if the user ask you to do some article or essay writting , you response are short like 'Yes i can definitely do that' then you actions lets say writing the article should be in the text entry of the json response
    {response: ".....", sources: [...], text:"", quizes: [{question: "", answer: "", options: []}] , flashcards: [{question: "...", answer: "..."}]}, should includ quiz or flashcards only if the requests is asking for flashcards or quiz questions

    When you are ask to generate x amount of quiz or flashcard you have to generate quiz or flashcards based on the text. If the messages doesn't specify a number the default number should be 10 so don't just send back a response you have to send either quizes or flashcards as per the request
    if the request is for quiz you have to include a quiz entry and it value will be the list of quiz questions, same applies for flashcards too,

    Keep the quiz questions short and answer short and the answer needs to be in the options

    This is the text to build your responses on
    Text=${text}
    `;
};
