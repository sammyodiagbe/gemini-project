"use client";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";

type LoadingContextType = {
  children: React.ReactNode;
};

type ContextType = {
  workingOnPdf: boolean;
  sendingChatMessage: boolean;
  gettingQuizQuestion: boolean;
  gettingFlashCard: boolean;
  setWorkingOnPdf: Dispatch<SetStateAction<boolean>>;
  setSendingChatMessage: Dispatch<SetStateAction<boolean>>;
  setGettingQuizQuestion: Dispatch<SetStateAction<boolean>>;
  setGettingFlashCard: Dispatch<SetStateAction<boolean>>;
  quizmode: boolean;
  setQuizmode: Dispatch<SetStateAction<boolean>>;
  isBreakTime: boolean;
  setIsBreakTime: Dispatch<SetStateAction<boolean>>;
  setBusyAI: Dispatch<SetStateAction<boolean>>;
  busyAI: boolean;
};

const loadingContext = createContext<ContextType>({
  workingOnPdf: false,
  sendingChatMessage: false,
  gettingQuizQuestion: false,
  gettingFlashCard: false,
  setWorkingOnPdf: () => {},
  setSendingChatMessage: () => {},
  setGettingQuizQuestion: () => {},
  setGettingFlashCard: () => {},
  quizmode: false,
  setQuizmode: () => {},
  isBreakTime: false,
  setIsBreakTime: () => {},
  busyAI: false,
  setBusyAI: () => {},
});

const LoadingStateContextProvider: FC<LoadingContextType> = ({ children }) => {
  const [workingOnPdf, setWorkingOnPdf] = useState(false);
  const [busyAI, setBusyAI] = useState(false);
  const [sendingChatMessage, setSendingChatMessage] = useState(false);
  const [gettingQuizQuestion, setGettingQuizQuestion] = useState(false);
  const [gettingFlashCard, setGettingFlashCard] = useState(false);
  const [quizmode, setQuizmode] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);

  return (
    <loadingContext.Provider
      value={{
        workingOnPdf,
        sendingChatMessage,
        gettingQuizQuestion,
        gettingFlashCard,
        setWorkingOnPdf,
        setSendingChatMessage,
        setGettingFlashCard,
        setGettingQuizQuestion,
        quizmode,
        setQuizmode,
        isBreakTime,
        setIsBreakTime,
        busyAI,
        setBusyAI,
      }}
    >
      {children}
    </loadingContext.Provider>
  );
};

export const useLoadingContext = () => {
  return useContext(loadingContext);
};

export default LoadingStateContextProvider;
