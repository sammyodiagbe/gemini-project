"use client";

import { FC } from "react";

type WrapperProps = {
  children: React.ReactNode;
};

const ToastWrapperProvider: FC<WrapperProps> = ({ children }) => {
  return <div className="">{children}</div>;
};

export default ToastWrapperProvider;
