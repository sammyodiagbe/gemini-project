"use client";
import { createContext, useContext, useState } from "react";

type ContextType = {
  openTopicsMenu: boolean;
  setOpenTopicsMenu: Function;
};

const componentsContext = createContext<ContextType>({
  openTopicsMenu: false,
  setOpenTopicsMenu: () => {},
});

const ComponentInteractionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openTopicsMenu, open] = useState<boolean>(false);
  const setOpenTopicsMenu = () => {
    open(!openTopicsMenu);
  };
  return (
    <componentsContext.Provider value={{ openTopicsMenu, setOpenTopicsMenu }}>
      {children}
    </componentsContext.Provider>
  );
};

export const useComponentInteractionsContext = () =>
  useContext(componentsContext);

export default ComponentInteractionsProvider;
