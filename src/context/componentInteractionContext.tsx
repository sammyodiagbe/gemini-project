"use client";
import { createContext, useContext, useState } from "react";

type ContextType = {
  openTopicsMenu: boolean;
  setOpenTopicsMenu: Function;
  closeTopicsMenu: Function;
};

const componentsContext = createContext<ContextType>({
  openTopicsMenu: false,
  setOpenTopicsMenu: () => {},
  closeTopicsMenu: () => {},
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

  const closeTopicsMenu = () => {
    open(false);
  };
  return (
    <componentsContext.Provider
      value={{ openTopicsMenu, setOpenTopicsMenu, closeTopicsMenu }}
    >
      {children}
    </componentsContext.Provider>
  );
};

export const useComponentInteractionsContext = () =>
  useContext(componentsContext);

export default ComponentInteractionsProvider;
