"use client";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import MyPdfViewer from "@/components/pdfViewer";
import ConversationComponent from "@/components/conversationComponent";
import { useConversationContext } from "@/context/conversationContext";
import { buttonIconSize, cn } from "@/lib/utils";
import { ChevronFirst, Upload } from "lucide-react";
import { useLoadingContext } from "@/context/loadingStateContext";
import { buttonClass } from "@/lib/tailwind_classes";
import LoaderComponent from "@/components/loader";
import { useQuizContext } from "@/context/quizContext";
import NewNoteComponent from "@/components/notes-components/newNote";
import TopicsComponent from "@/components/pdf_components/topicsComponent";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const [fileUrl, setFile] = useState<string | null>(null);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const { setConversation, reset } = useConversationContext()!;
  const { setWorkingOnPdf, workingOnPdf, busyAI } = useLoadingContext()!;
  const { quizmode } = useQuizContext();
  const { initGemini } = useConversationContext();
  const { toast } = useToast();
  useEffect(() => {
    reset();
  }, []);
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const { target } = event;
    const file = target.files!;
    if (!file) return;
    reset();
    handleFileUpload(file[0]);
    setConversation([]);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    const fileUrl = await URL.createObjectURL(file);
    formData.append("file", file);
    try {
      // so now the plan is to be able to upload the images directly to gemini api

      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64 = fileReader.result as string;
        initGemini(base64);
      };

      fileReader.readAsDataURL(file);

      setFile(fileUrl);
    } catch (error: any) {
      setWorkingOnPdf(false);
      setFile(null);
      toast({
        description:
          "Oh no, something went wrong, please try uploading a file again",
      });
    }
  };

  if (workingOnPdf) return <LoaderComponent />;
  return (
    <main
      className={cn(
        "flex h-screen max-h-[calc(100vh-70px)] w-screen overflow-hidden",
        !fileUrl ? "" : ""
      )}
    >
      <NewNoteComponent />
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
              "w-0 max-w-[40.875rem] h-full select-none transition-all duration-300 ease-in-out",
              openSidebar ? "w-[40.875rem]" : "w-0"
            )}
          >
            <div className={cn("relative h-full transition-all")}>
              <label
                htmlFor="pdf_file"
                aria-disabled={quizmode || busyAI}
                className={cn(
                  buttonClass,
                  "absolute bg-background text-foreground shadow-md   bottom-10  right-[50px] hover:scale-1 cursor-pointer z-[25]"
                )}
              >
                <Upload size={buttonIconSize} className="mr-2" /> Upload New
                File
              </label>
              <MyPdfViewer filePath={fileUrl!} />
              <TopicsComponent />
              <div className="absolute left-full top-0 space-y-1 z-10">
                <button
                  className={cn(
                    "w-14 h-14 flex text-white items-center cursor-pointer justify-center rounded-r-md  bg-purple-400 hover:bg-purple-500 "
                  )}
                  onClick={() => setOpenSidebar((prev) => !prev)}
                >
                  <ChevronFirst
                    className={cn(
                      "transition-all delay-500 duration-500 ease-in-out",
                      openSidebar ? " rotate-0" : "rotate-180"
                    )}
                  />
                </button>
              </div>
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
