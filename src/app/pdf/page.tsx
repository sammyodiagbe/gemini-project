"use client";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Gemini as AI } from "@/gemini/gemini";
import MyPdfViewer from "@/components/pdfViewer";
import ConversationComponent from "@/components/conversationComponent";
import { useConversationContext } from "@/context/conversationContext";
import { buttonIconSize, cn, jsonDecode } from "@/lib/utils";
import { generateInitialPossibleInteractions } from "@/lib/gemini_interactons";
import {
  ChevronFirst,
  ChevronLast,
  Upload,
  UploadCloudIcon,
} from "lucide-react";
import { useLoadingContext } from "@/context/loadingStateContext";
import { buttonClass } from "@/lib/tailwind_classes";
import LoaderComponent from "@/components/loader";
import { useQuizContext } from "@/context/quizContext";

const Page = () => {
  const [fileUrl, setFile] = useState<string | null>(null);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const { setExtractedText, setInteractions, setConversation } =
    useConversationContext()!;
  const { setWorkingOnPdf, workingOnPdf, busyAI } = useLoadingContext()!;
  const { quizmode } = useQuizContext();

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const { target } = event;
    const file = target.files!;
    if (!file) return;
    handleFileUpload(file[0]);

    setWorkingOnPdf(true);
    setConversation([]);
    setInteractions([]);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    const fileUrl = await URL.createObjectURL(file);
    formData.append("file", file);

    try {
      const {
        data: { extracted_text },
      } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload_file`,
        formData,
        {
          onDownloadProgress: (event) => console.log(event),
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = await AI.generateContent(
        generateInitialPossibleInteractions(extracted_text)
      );
      const response = await result.response;
      const text = await response.text();
      const json = jsonDecode(text);

      const { interactions } = json;
      setInteractions(interactions);
      setFile(fileUrl);
      setExtractedText(extracted_text);
      setWorkingOnPdf(false);
    } catch (error: any) {
      setWorkingOnPdf(false);
    }
  };

  if (workingOnPdf) return <LoaderComponent />;
  return (
    <main
      className={cn(
        "flex h-screen max-h-[calc(100vh-70px)] w-screen ",
        !fileUrl ? "" : ""
      )}
    >
      {fileUrl === null ? (
        <div className="flex-1 w-full h-full flex items-center justify-center select-none">
          <div className="max-w-[600px] space-y-5 text-center">
            <h1 className="text-8xl text-center mb-5 font-light ">
              What are we{" "}
              <span className="text-fuchsia-500/90 font-black">studying</span>{" "}
              today?
            </h1>
            <label
              htmlFor="pdf_file"
              className={cn(
                buttonClass,
                "inline-flex mx-auto text-lg px-9 cursor-pointer"
              )}
            >
              Upload a study file
            </label>
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "w-[46.875rem] max-w-[46.875rem] h-full select-none transition-all duration-300 ease-in-out",
              openSidebar ? "w-0" : "w-[46.875rem"
            )}
          >
            <div className={cn("relative h-full transition-all")}>
              <label
                htmlFor="pdf_file"
                aria-disabled={quizmode || busyAI}
                className={cn(
                  buttonClass,
                  "absolute   bottom-10 ring-2 ring-purple-600 right-[50px] text-purple-600 bg-white hover:scale-110 cursor-pointer z-5"
                )}
              >
                <Upload size={buttonIconSize} className="mr-2" /> Upload New
                File
              </label>
              <MyPdfViewer filePath={fileUrl!} />
              <button
                className={cn(
                  "w-14 h-14 flex items-center justify-center absolute  left-full rounded-md top-0 bg-purple-400 hover:bg-purple-500"
                )}
                onClick={() => setOpenSidebar((prev) => !prev)}
              >
                <ChevronFirst
                  className={cn(
                    "transition-all delay-300 duration-300 ease-in-out",
                    openSidebar ? " rotate-180" : "rotate-0"
                  )}
                />
              </button>
            </div>
          </div>
          <ConversationComponent />
        </>
      )}
      <input
        type="file"
        accept="application/pdf"
        name="pdf_file"
        id="pdf_file"
        className="appearance-none hidden"
        onChange={handleFileChange}
      />
    </main>
  );
};

export default Page;
