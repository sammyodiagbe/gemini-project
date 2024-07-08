"use client";

import { useToastContext } from "@/context/toastContext";
import { FC } from "react";
import Toast from "./toastComponent";
import { AnimatePresence } from "framer-motion";

type WrapperProps = {};

const ToastWrapperProvider: FC<WrapperProps> = ({}) => {
  const { toasts } = useToastContext();
  return [
    <div className="fixed top-2 right-0 w-[25rem] p-2 z-[500] h-auto space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.reverse().map((toast, index) => {
          return <Toast toast={toast} key={index} />;
        })}
      </AnimatePresence>
    </div>,
  ];
};

export default ToastWrapperProvider;
