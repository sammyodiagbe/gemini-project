import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type QuizContextType = {
  quizmode: boolean;
  setQuizmode: Dispatch<SetStateAction<boolean>>;
};

const quizContext = createContext<QuizContextType>({
  quizmode: false,
  setQuizmode: () => {},
});

const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizmode, setQuizmode] = useState(false);
  return (
    <quizContext.Provider value={{ quizmode, setQuizmode }}>
      {children}
    </quizContext.Provider>
  );
};

export const useQuizContext = () => {
  return useContext(quizContext);
};

export default QuizContextProvider;
