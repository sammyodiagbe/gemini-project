"use client";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Gemini as AI } from "@/gemini/gemini";
import MyPdfViewer from "@/components/pdfViewer";
import ConversationComponent from "@/components/conversationComponent";
import { useConversationContext } from "@/context/conversationContext";
import { jsonDecode } from "@/lib/utils";
import { generateInitialPossibleInteractions } from "@/lib/gemini_interactons";

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
    } catch (error: any) {
      console.log("Something went wrong");
      console.log(error);
    }
  };

  return (
    <main className="grid grid-cols-[700px_1fr] h-screen w-screen">
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
      <div className="relative w-full h-full bg-red-300">
        {!fileUrl && (
          <label
            className=" grid items-center justify-center absolute h-full w-full  bg-green-500 top-0 left-0"
            htmlFor="pdf_file"
          >
            <span className="">Click here to upload your pdf</span>
          </label>
        )}
        <input
          type="file"
          accept="application/pdf"
          name="pdf_file"
          id="pdf_file"
          className="appearance-none hidden"
          onChange={handleFileChange}
        />
        {fileUrl && <MyPdfViewer filePath={fileUrl!} />}
      </div>
      <ConversationComponent />
    </main>
  );
};

export default Page;
