"use client";

import { useToastContext } from "@/context/toastContext";
import { FC } from "react";
import Toast from "./toastComponent";
import { AnimatePresence } from "framer-motion";

type WrapperProps = {};

const ToastWrapperProvider: FC<WrapperProps> = ({}) => {
  const { toasts } = useToastContext();
  return (
    <AnimatePresence>
      <div className="fixed top-0 right-0 w-[25rem]  z-[500] h-auto space-y-2">
        {toasts.reverse().map((toast, index) => {
          return <Toast toast={toast} key={index} />;
        })}
      </div>
    </AnimatePresence>
  );
};

export default ToastWrapperProvider;
