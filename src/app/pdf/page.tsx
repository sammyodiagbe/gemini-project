"use client";
import axios from "axios";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useState,
} from "react";
import { Gemini as AI } from "@/gemini/gemini";
import { Document } from "@react-pdf/renderer";
import MyPdfViewer from "@/components/pdfViewer";
import ConversationComponent from "@/components/conversationComponent";
import { useConversationContext } from "@/context/conversationContext";
import { jsonDecode } from "@/lib/utils";

const Page = () => {
  const [fileUrl, setFile] = useState<string>();
  const { setExtractedText, setInteractions } = useConversationContext();

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
        `Hey Gemini, 
        Analyze the text and generate 4 possible interactions a user might want to have with ypu in regards to the text article below
        If the text has no clarity or direction you can ignore and just send a message back letting the user know their isn't clarity you could also add an entry in your response that sets clarity: false. The structure of each interaction object should always be { text: "..."}

        Here is another thing to not, not all text given to you are for education purpose, some could be resumes, cover letters, you need to detect and create appropriate possible interactions

        Also add a field in the root of your response that type of article. It is up to you to determine if this is a school work, an article, a resume, a cover letter etc.

        An example of interactions would be, let say i send you an article on microplasticity, interactions I as a user would want to have with the article might be Summarize the text, Point of key note, create notes based on text, How does MicroPlasticity affect our enviroment
  
        text=${extracted_text}`
      );
      const response = await result.response;
      const json = jsonDecode(response.text());

      console.log(extracted_text);
      console.log("Gemini response");
      console.log(json);
      setFile(URL.createObjectURL(file).toString());
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
