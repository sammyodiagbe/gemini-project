"use client";

import { useConversationContext } from "@/context/conversationContext";
import { Gemini as AI } from "@/gemini/gemini";
import { buttonClass } from "@/lib/tailwind_classes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import ImageComponent from "@/components/imageComponent";

const h1Class = "text-5xl max-w-[700px] mx-auto font-bold leading-2";
const pClass = "max-w-[600px] mx-auto";
const linkClass = " max-w-200px p-2 px-5 rounded-sm bg-fuchsia-500 text-white";
const imageContainer = "inline-block mx-auto";

export default function Home() {
  const [message, setMessage] = useState("");
  const { reset } = useConversationContext();

  useEffect(() => {
    reset();
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
    <main className="p-3 py-8 space-y-[100px]">
      <header className="text-center space-y-7">
        <h1 className="text-5xl max-w-[700px] mx-auto font-bold leading-2">
          Meet Naala, your perfect Study Partner: AI-Powered, Always Available
        </h1>
        <p className="max-w-[600px] mx-auto">
          Boost your study sessions with personalized AI support, interactive
          quizzes, and real-time feedback.
        </p>
        <div>
          <Link
            href={"/hello"}
            className=" max-w-200px p-2 px-5 rounded-sm bg-fuchsia-500 text-white"
          >
            {" "}
            Get Started
          </Link>
        </div>

        <div className="inline-block mx-auto">
          <ImageComponent src={"/images/header_image.svg"} alt="Naala ai" />
        </div>
      </header>
      <section className="grid grid-cols-2 gap-8">
        <div className="">
          <ImageComponent
            src="/images/quizes.svg"
            alt="Get quizes to enhance learning"
          />
        </div>
        <div className="space-y-8">
          <h1 className="text-5xl max-w-[700px] font-bold leading-2">
            Quizes for better understanding
          </h1>
          <p className="max-w-[600px] leading-8">
            With our AI-powered study partner, you’ll have access to a wide
            range of interactive quizzes tailored to your learning needs. These
            quizzes aren’t just random questions; they’re designed to target
            your weak spots and reinforce your strengths, helping you grasp
            complex concepts more effectively. By providing instant feedback and
            detailed explanations, our app ensures that you not only test your
            knowledge but also deepen your understanding, turning every quiz
            into a valuable learning opportunity.
          </p>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-8">
        <div className="">
          <ImageComponent
            src="/images/flashcard.svg"
            alt="Get Flashcard to enhance learning"
          />
        </div>
        <div className="space-y-8">
          <h1 className="text-5xl max-w-[700px] font-bold leading-2">
            Flashcards to get the neurons going.
          </h1>
          <p className="max-w-[600px] leading-8">
            Unlock the power of efficient learning with our dynamic flashcards.
            Naala generates customized flashcards based on your study material,
            helping you reinforce key concepts and memorize important
            information quickly. Each flashcard is designed to enhance your
            retention and recall, offering spaced repetition and interactive
            features that make reviewing more engaging and effective. By turning
            your study sessions into a more active and targeted experience, our
            flashcards help you master your material with confidence.
          </p>
        </div>
      </section>
      <section className="text-center space-y-7 gap-8">
        <h1 className="text-5xl max-w-[750px] mx-auto font-bold leading-2 text-center">
          Master your subjects with precision.
        </h1>
        <p className="max-w-[650px] mx-auto text-center leading-7">
          Our app’s “Topic Lock” feature empowers you to zero in on the subjects
          that matter most to you. By selecting a specific topic, you can tailor
          your study sessions to address key areas of interest or challenge,
          ensuring a focused and efficient learning experience.
        </p>

        <div>
          <Link
            href={"/hello"}
            className="max-w-200px p-2 px-5 rounded-sm bg-fuchsia-500 text-white"
          >
            Get Started
          </Link>
        </div>
        <div className="inline-block mx-auto">
          <ImageComponent src={"/images/lock.svg"} alt="Naala ai" />
        </div>
      </section>
      <section className="grid grid-cols-2 gap-8">
        <div className="">
          <ImageComponent
            src="/images/insight.svg"
            alt="Get quizes to enhance learning"
          />
        </div>
        <div className="space-y-8">
          <h1 className={"text-5xl max-w-[700px] font-bold leading-2"}>
            Instand Feedbacks and Insights.
          </h1>
          <p className={"max-w-[600px] leading-8"}>
            Our app’s Feedback & Insights feature provides you with valuable,
            real-time evaluations of your study progress. After each quiz or
            exercise, you receive detailed feedback and personalized insights
            into your performance, highlighting both strengths and areas for
            improvement. This feature helps you understand your learning
            patterns, adjust your study strategies, and focus on topics that
            need more attention.
          </p>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-8">
        <div className="">
          <ImageComponent
            src="/images/note.svg"
            alt="Get Flashcard to enhance learning"
          />
        </div>
        <div className="space-y-8">
          <h1 className={"text-5xl max-w-[700px] font-bold leading-2"}>
            Effortless Note-Taking: AI-Driven summaries
          </h1>
          <p className={"max-w-[600px] leading-8"}>
            Our AI Note Generation feature transforms your study materials into
            organized, comprehensive notes with just a few clicks. By analyzing
            your content, the AI creates concise summaries, highlights key
            concepts, and structures information for easy review. This tool not
            only saves you time but also ensures that your notes are thorough
            and tailored to your learning needs
          </p>
        </div>
      </section>
      <section className="text-center space-y-7">
        <h1 className="text-5xl max-w-[750px] mx-auto font-bold leading-2 text-center">
          Download and Study anywhere
        </h1>
        <p className="max-w-[650px] mx-auto text-center leading-7">
          With our Downloadable Quizzes and Notes feature, you can take your
          study materials offline and access them anytime, anywhere. Whether you
          need to review quizzes for a test or revisit your notes on the go,
          this feature ensures you have all the essential resources at your
          fingertips.
        </p>
        <div>
          <Link
            href={"/hello"}
            className="max-w-200px p-2 px-5 rounded-sm bg-fuchsia-500 text-white"
          >
            Get Started
          </Link>
        </div>

        <div className="inline-block mx-auto">
          <ImageComponent src={"/images/download.svg"} alt="Naala ai" />
        </div>
      </section>
    </main>
  );
}
