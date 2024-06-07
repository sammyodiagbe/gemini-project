"use client";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Gemini as AI } from "@/gemini/gemini";
import MyPdfViewer from "@/components/pdfViewer";
import ConversationComponent from "@/components/conversationComponent";
import { useConversationContext } from "@/context/conversationContext";
import { jsonDecode } from "@/lib/utils";
import { generateInitialPossibleInteractions } from "@/lib/gemini_interactons";
import { File, UploadCloudIcon } from "lucide-react";

const Page = () => {
  const [fileUrl, setFile] = useState<string>();
  const { setExtractedText, setInteractions } = useConversationContext()!;

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const { target } = event;
    const file = target.files!;
    if (!file) return;
    handleFileUpload(file[0]);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    const fileUrl = await URL.createObjectURL(file);
    formData.append("file", file);

    try {
      const {
        data: { extracted_text },
      } = await axios.post("http://localhost:5000/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    } catch (error: any) {}
  };

  return (
    <main className="grid grid-cols-[800px_1fr] h-screen max-h-screen w-screen">
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
            <label
              className="bg-backgroundColor grid items-center justify-center absolute h-full w-full  top-0 left-0 hover:bg-gray-200 hover:ring-primary/70 ring-inset cursor-pointer border-r border-gray-400"
              htmlFor="pdf_file"
            >
              <span className="grid place-items-center max-w-[350px] space-y-4">
                <UploadCloudIcon
                  size={120}
                  className="font-thin text-gray-400"
                />
                <span className="text-center text-2xl">
                  Click here to choose a file to upload (pdf only)
                </span>
              </span>
            </label>

            <input
              type="file"
              accept="application/pdf"
              name="pdf_file"
              id="pdf_file"
              className="appearance-none hidden"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <MyPdfViewer filePath={fileUrl!} />
        )}
      </div>
      <ConversationComponent />
    </main>
  );
};

export default Page;
