"use client";
import { ToastType } from "@/lib/type";
import { createContext, useContext, useState } from "react";

type ComponentType = {
  toasts: ToastType[];
  updateToasts: Function;
  removeToast: Function;
};

const toastContext = createContext<ComponentType>({
  toasts: [],
  updateToasts: () => {},
  removeToast: () => {},
});

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const updateToasts = (toast: ToastType) => {
    setToasts((prev) => [...prev, toast]);
  };

  const removeToast = (toast: ToastType) => {
    setToasts((prev) => prev.filter((t) => t != toast));
    console.log(toasts);
  };
  return (
    <toastContext.Provider value={{ toasts, updateToasts, removeToast }}>
      {children}
    </toastContext.Provider>
  );
};

export default ToastProvider;
export const useToastContext = () => {
  return useContext(toastContext);
};
