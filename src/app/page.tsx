"use client";

import { Gemini as AI } from "@/gemini/gemini";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(AI.model);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!message || message == "") return;

    const result = await AI.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log(text);
    setMessage("");
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-full w-full">
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            className="resize-none border"
            onChange={({ target }) => setMessage(target.value)}
            placeholder="Ask ally anything..."
          ></textarea>
          <div>
            <button>Send message</button>
          </div>
        </form>
      </div>
    </main>
  );
}
