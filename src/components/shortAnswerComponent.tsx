import { useQuizContext } from "@/context/quizContext";
import { QuizQuestionType, QuizResponseType } from "@/lib/type";
import { buttonIconSize } from "@/lib/utils";
import { LoaderPinwheel } from "lucide-react";
import { FC, useEffect, useState } from "react";

type ComponentType = {
  question: QuizQuestionType;
  updateResponse: Function;
  time: number;
};

const ShortAnswerQuestionComponent: FC<ComponentType> = ({
  question,
  updateResponse,
  time,
}) => {
  const { question: ques, answer } = question;
  const [responseText, setResponseText] = useState("");
  const [checkingResponse, setCheckingResponse] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const { checkShortAnswer } = useQuizContext();

  useEffect(() => {
    setResponseText("");
    setCheckingResponse(false);
    setFeedback("");
    setAnswered(false);
  }, [question]);

  const checkUserResponse = async () => {
    // check to see if the user understands the question and topic
    // remember the whole purpose of this app is understanding and not being right
    if (responseText.trim() === "") return;
    setCheckingResponse(true);
    const feedback = await checkShortAnswer(responseText, answer, ques);
    setCheckingResponse(false);
    setFeedback(feedback);
    setAnswered(true);
    const response: QuizResponseType = {
      question: ques,
      answer,
      userAnswer: responseText,
    };
    const ele: HTMLElement = document.getElementById("conversation")!;
    ele.scrollTo({
      top: ele.scrollHeight,
      behavior: "smooth",
    });
    updateResponse(response);
  };
  return (
    <div className="">
      <h1 className="text-2xl font-extrabold mb-4">{ques}</h1>
      <div className=" bg-secondary p-3 rounded-lg">
        <textarea
          className="w-full resize-none outline-none border-none bg-transparent   rounded"
          rows={3}
          placeholder="Enter answer here (remember it is more about learning not being right)"
          value={responseText}
          onChange={(event) => setResponseText(event.target.value)}
        ></textarea>
        {!answered && (
          <div className="flex justify-end">
            <button
              className="p-2 bg-purple-500 text-white rounded-full scale-95 hover:scale-100 transition-all"
              onClick={() => checkUserResponse()}
              disabled={checkingResponse || answered}
            >
              {checkingResponse ? (
                <LoaderPinwheel
                  size={buttonIconSize}
                  className="animate-spin"
                />
              ) : (
                "Check Response"
              )}
            </button>
          </div>
        )}
        {answered && (
          <div className="my-4">
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortAnswerQuestionComponent;
