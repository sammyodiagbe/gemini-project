"use client";
import { createContext, useContext, useState } from "react";

type ToastType = {
  title: string;
  body: string;
  type: "error" | "success" | "warning";
};

type ComponentType = {
  toasts: ToastType[];
  updateToasts: Function;
};

const toastContext = createContext<ComponentType>({
  toasts: [],
  updateToasts: () => {},
});

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const updateToasts = (toast: ToastType) => {};
  return (
    <toastContext.Provider value={{ toasts, updateToasts }}>
      {children}
    </toastContext.Provider>
  );
};

export default ToastProvider;
export const useToastContext = () => {
  return useContext(toastContext);
};
