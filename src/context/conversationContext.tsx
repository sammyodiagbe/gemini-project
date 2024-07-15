"use client";
import {
  FC,
  useContext,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { Gemini as AI } from "@/gemini/gemini";
import { ChatSession, TextPart } from "@google/generative-ai";
import { createConversationObject, jsonDecode, processText } from "@/lib/utils";
import { ConversationType, ImageDataType } from "@/lib/type";

import {
  generateFlashcardGemini,
  generateInitialPossibleInteractions,
  generateQuizGemini,
  generateTopics,
} from "@/lib/gemini_interactons";
import { useLoadingContext } from "./loadingStateContext";
import { useToastContext } from "./toastContext";

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  extractedText: string[];
  setExtractedText: Dispatch<SetStateAction<string[]>>;
  chatWithGemini: Function;
  conversation: ConversationType[];
  startQuizMode: Function;
  nextQuestion: Function;
  getFlashCard: Function;
  setConversation: Dispatch<SetStateAction<ConversationType[]>>;
  chat: ChatSession | null;
  attemptQueryRetry: Function;
  gotData: boolean;
  updateDataState: Function;
  updateImagesData: Function;
  updateExtractedText: Function;
  reset: Function;
  topics: string[];
  docType: string;
  focusTopics: string[];
  addTopicToFocus: Function;
  removeTopicFromFocus: Function;
  removeAllFocusTopics: Function;
  documentImagesData: ImageDataType[];
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: [],
  setExtractedText: () => {},
  chatWithGemini: () => {},
  conversation: [],
  startQuizMode: () => {},
  nextQuestion: () => {},
  getFlashCard: () => {},
  setConversation: () => {},
  attemptQueryRetry: () => {},
  chat: null,
  gotData: false,
  reset: () => {},
  updateDataState: () => {},
  updateImagesData: () => {},
  updateExtractedText: () => {},
  topics: [],
  docType: "",
  focusTopics: [],
  addTopicToFocus: () => {},
  removeTopicFromFocus: () => {},
  removeAllFocusTopics: () => {},
  documentImagesData: [],
});

type ConversationContextType = {
  children: React.ReactNode;
};

const ConversationContextProvider: FC<ConversationContextType> = ({
  children,
}) => {
  const [interactions, setInteractions] = useState<interaction[]>([]);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [conversation, setConversation] = useState<ConversationType[]>([]);
  const [gotData, setGotData] = useState<boolean>(false);
  const [documentImagesData, setDocumentImages] = useState<ImageDataType[]>([]);
  const { setBusyAI, busyAI } = useLoadingContext();
  const [topics, setTopics] = useState<string[]>([]);
  const [docType, setDocType] = useState<string>("");
  const { setWorkingOnPdf } = useLoadingContext();
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const { updateToasts } = useToastContext();

  useEffect(() => {
    if (gotData) {
      initGemini();
    }
  }, [gotData]);

  const initGemini = async () => {
    setWorkingOnPdf(true);
    const history = [];
    const initInstruction: TextPart = {
      text: "You have been given a chunk of data in the history, i have pulled out the text from a pdf and broken them down into chunks, and i have also assigned by pages, user would converse with you based on this history. you are an ai study buddy. make sure your json string response and well formated, Your name is Nala and you are a study buddy, if asked who created you, say it is Samson. For quizes, initial level is 'piece of cake' except if I send in a level increase, there are three type of levels ['piece of cake', 'Sweating bullets', 'Herculean feat'], they start from level 1 to 3",
    };
    try {
      // for (let index = 0; index < documentImagesData?.length; index++) {
      //   const inlineImage = processImage(documentImagesData[index]);
      //   history.push({ role: "user", parts: [inlineImage] });
      // }
      // const initMessage = geminiDocumentInitInstruction(extractedText!);
      // const initConversationText = processText(initMessage);
      if (!extractedText.length) return;
      for (let a = 0; a < extractedText?.length; a++) {
        const text = extractedText[a];
        const textPart = processText(a, text);
        history.push({ role: "user", parts: [textPart] });
      }

      let chat = await AI.startChat({
        history: [{ role: "user", parts: [initInstruction] }, ...history],
      });

      console.log(await chat.getHistory());
      await generatePossibleInteractions(chat);
      // get all the possible topics from the document so a user can lock onto a topic
      await generatePossibleTopics(chat);
      setChat(chat);
      setWorkingOnPdf(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const generatePossibleInteractions = async (chat: ChatSession) => {
    const message = generateInitialPossibleInteractions();
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(message);
      for await (let chunk of result.stream) {
        jsonString += chunk.text();
      }

      const { interactions, type } = jsonDecode(jsonString);
      setInteractions((prev) => interactions);
      console.log(interactions);
      setDocType(type);
    } catch (error: any) {
      console.log(error);
    }
  };

  const generatePossibleTopics = async (chat: ChatSession) => {
    const prompt = generateTopics();
    let resText = "";
    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (const chunk of result.stream) {
        resText += chunk?.text();
      }
      const { topics } = jsonDecode(resText);
      console.log(topics);
      setTopics(topics);
    } catch (error: any) {
      console.log(error);
    }
  };

  const addTopicToFocus = async (text: string) => {
    setFocusTopics((prev) => [...prev, text]);
  };

  const removeTopicFromFocus = async (topic: string) => {
    setFocusTopics((prev) => prev.filter((t) => t !== topic));
  };

  const removeAllFocusTopics = () => {
    setFocusTopics((prev) => []);
  };

  const updateDataState = (state: boolean) => {
    setGotData(state);
  };

  const chatWithGemini = async (message: string) => {
    const obj = createConversationObject("chat", "user", message);
    setConversation((prev) => [...prev, obj]);
    setBusyAI(true);
    const prompt = `I need you to answer the question i have asked and in your json response , an entry of response should be present, this is the question, ${message}`;
    let res = "";
    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (const chunk of result?.stream!) {
        res += chunk.text();
      }
      console.log(res);
      const { response } = jsonDecode(res);
      console.log(response);
      let aiResponse: ConversationType = {
        message: response,
        sender: "ai",
        type: "chat",
      };

      // console.log(decodejson);
      // const { response: res } = decodejson;
      // console.log(res);
      // const convoObj: ConversationType = {
      //   type: "chat",
      //   sender: "ai",
      //   message: res,
      // };

      setConversation((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.log(error);
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "chat",
        },
      ]);
    }
    setBusyAI(false);
  };

  const reset = () => {
    setChat(null);
    setExtractedText([]);
    setDocumentImages([]);
    setGotData(false);
    setFocusTopics([]);
  };

  const startQuizMode = async () => {
    const message = generateQuizGemini();
    setBusyAI(true);
    let jsonString = "";
    try {
      const response = await chat?.sendMessageStream(message);
      for await (let chunk of response?.stream!) {
        jsonString += chunk.text();
      }
      const jsonData = jsonDecode(jsonString!);
      const { response: res, quiz } = jsonData;
      const convoobj = createConversationObject("quiz", "ai", res, quiz);
      setConversation((prev) => [...prev, convoobj]);
    } catch (error: any) {
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "quiz",
        },
      ]);
    }
    setBusyAI(false);
  };

  const nextQuestion = async () => {
    const message = "Next Question please, Don't repeat questions.";
    setBusyAI(true);
    let jsonString = "";
    try {
      const response = await chat?.sendMessageStream(message);
      for await (let chunk of response?.stream!) {
        jsonString += chunk.text();
      }
      const { response: res, quiz } = jsonDecode(jsonString!);
      const obj = createConversationObject("quiz", "ai", res, quiz);
      setConversation((prev) => [...prev, obj]);
    } catch (error: any) {
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "quiz",
        },
      ]);
    }
    setBusyAI(false);
  };

  const getFlashCard = async () => {
    setBusyAI(true);
    const message = generateFlashcardGemini();
    let jsonString = "";
    try {
      const requestFlashCard = await chat?.sendMessageStream(message);
      for await (let chunk of requestFlashCard?.stream!) {
        jsonString += chunk.text();
      }
      const { response: res, flashcard } = jsonDecode(jsonString!);
      const chatMessage: ConversationType = {
        message: res,
        flashcard,
        type: "flashcard",
        sender: "ai",
      };

      setConversation((prev) => [...prev, chatMessage]);
    } catch (error: any) {
      console.log(error);
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "flashcard",
        },
      ]);
    }
    setBusyAI(false);
  };

  const attemptQueryRetry = async (retryQuery: string, errorOrigin: string) => {
    setBusyAI(true);
    try {
      const result = await chat?.sendMessage(retryQuery);
      const response = await result?.response;
      const text = response?.text();

      const json = jsonDecode(text!);
      console.log(json);
      setConversation((prev) =>
        [
          ...prev,
          { ...json, message: json.response, type: errorOrigin },
        ].filter((entry) => entry.type != "errror")
      );
    } catch (error: any) {
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: retryQuery,
          type: "error",
          errorOrigin: "flashcard",
        },
      ]);
    }
    setBusyAI(false);
  };

  // update image data
  const updateImagesData = (images: ImageDataType[]) => {
    console.log(images);
    setDocumentImages(images);
  };

  const updateExtractedText = (data: string[]) => {
    setExtractedText(data);
  };
  return (
    <conversationContext.Provider
      value={{
        interactions,
        extractedText,
        setExtractedText,
        chatWithGemini,
        conversation,
        startQuizMode,
        nextQuestion,
        getFlashCard,
        setConversation,
        chat,
        attemptQueryRetry,
        gotData,
        updateDataState,
        updateImagesData,
        updateExtractedText,
        reset,
        topics,
        docType,
        addTopicToFocus,
        focusTopics,
        removeTopicFromFocus,
        removeAllFocusTopics,
        documentImagesData,
      }}
    >
      {children}
    </conversationContext.Provider>
  );
};

export const useConversationContext = () => {
  return useContext(conversationContext);
};

export default ConversationContextProvider;
