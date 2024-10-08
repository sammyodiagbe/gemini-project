"use client";

import AnimatedTextComponent from "@/components/animatedText";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/lib/tailwind_classes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactTyped } from "react-typed";

const Page = () => {
  const [name, setName] = useState("");
  const [hasProvidedName, setHasProvdiedName] = useState(false);
  const [showNavLink, setShowNavLink] = useState(false);

  const provideName = () => {
    if (name.trim() === "") return;
    setHasProvdiedName(true);
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="max-w-[35rem] space-y-3">
        <AnimatedTextComponent
          classStyle="text-6xl font-bold mb-7 leading-[3.5rem]"
          text="Hi there, I'm Naala, your study partner."
          Wrapper={"h1"}
        />

        <AnimatePresence>
          {!hasProvidedName ? (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 3.8 }}
            >
              <h1 className="">What can i call you ?</h1>
              <input
                type="text"
                placeholder="Your name"
                className="w-full outline-none border-none bg-secondary p-3 py-4 rounded-md"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <div className="py-4">
                <button
                  className={cn(buttonClass, "p-6 py-3 font-bold")}
                  onClick={() => provideName()}
                >
                  Let's go
                </button>
              </div>
            </motion.div>
          ) : (
            <div>
              <ReactTyped
                typeSpeed={50}
                strings={[
                  `Awesome ${name}, nice to meet you, let's get this study party started.`,
                ]}
                className="text-lg"
                onComplete={() => {
                  setShowNavLink(true);
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4 }}
                className="py-4 flex justify-end"
              >
                {showNavLink ? (
                  <Link
                    href={`/pdf?name=${name}`}
                    className={cn(buttonClass, "p-6 py-3")}
                  >
                    I am ready
                  </Link>
                ) : null}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
