"use client";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Gemini as AI } from "@/gemini/gemini";
import MyPdfViewer from "@/components/pdfViewer";
import ConversationComponent from "@/components/conversationComponent";
import { useConversationContext } from "@/context/conversationContext";
import { buttonIconSize, cn, jsonDecode } from "@/lib/utils";
import { generateInitialPossibleInteractions } from "@/lib/gemini_interactons";
import { Upload, UploadCloudIcon } from "lucide-react";
import { useLoadingContext } from "@/context/loadingStateContext";
import { buttonClass } from "@/lib/tailwind_classes";
import LoaderComponent from "@/components/loader";

const Page = () => {
  const [fileUrl, setFile] = useState<string>();
  const { setExtractedText, setInteractions, setConversation } =
    useConversationContext()!;
  const { setWorkingOnPdf, workingOnPdf } = useLoadingContext()!;

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
    <main className="grid grid-cols-[800px_1fr] h-screen max-h-[calc(100vh-70px)] w-screen">
      {/* <div className="">
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button type="submit">Upload Pdf</button>
        </form>
      </div> */}
      <div className="relative w-full h-full ">
        {!fileUrl ? (
          <>
            {workingOnPdf ? (
              <div className="h-full w-full bg-orange-400">
                <p>Working on the pdf yo</p>
              </div>
            ) : (
              <label
                className="bg-backgroundColor grid items-center justify-center absolute h-full w-full  top-0 left-0 hover:ring-primary/70 ring-inset cursor-pointer border-r border-onBackground"
                htmlFor="pdf_file"
              >
                <span className="grid place-items-center max-w-[350px] space-y-4">
                  <UploadCloudIcon
                    size={120}
                    className="font-thin text-textColor/30"
                  />
                  <span className="text-center text-2xl text-textColor/60">
                    Click here to choose a file to upload (pdf only)
                  </span>
                </span>
              </label>
            )}
          </>
        ) : (
          <div className="relative h-full w-full">
            <label
              htmlFor="pdf_file"
              className={cn(
                buttonClass,
                "absolute  z-10 bottom-10 ring-2 ring-purple-600 right-[50px] text-purple-600 bg-white hover:scale-110 cursor-pointer"
              )}
            >
              <Upload size={buttonIconSize} className="mr-2" /> Upload New File
            </label>
            <MyPdfViewer filePath={fileUrl!} />
          </div>
        )}
      </div>
      <input
        type="file"
        accept="application/pdf"
        name="pdf_file"
        id="pdf_file"
        className="appearance-none hidden"
        onChange={handleFileChange}
      />

      <ConversationComponent />
    </main>
  );
};

export default Page;
