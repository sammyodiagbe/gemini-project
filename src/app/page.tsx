"use client";

import { Gemini as AI } from "@/gemini/gemini";
import { buttonClass } from "@/lib/tailwind_classes";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
      <div className="h-full w-[800px] mx-auto text-center">
        <h1 className="text-8xl">Rafikiai Landing page is coming soon</h1>
        <Link
          href="/pdf"
          className={cn(buttonClass, "mt-10 inline-flex font-lg")}
        >
          Try the App now
        </Link>
      </div>
    </main>
  );
}
