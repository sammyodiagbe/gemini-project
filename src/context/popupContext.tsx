"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Coord = {
  x: number;
  y: number;
};

type PopupPropsType = {
  selected: boolean;
  setSelected: Dispatch<SetStateAction<boolean>>;
  selectedText: string;
  setSelectedText: Dispatch<SetStateAction<string>>;
  coord: Coord;
  setCoord: Dispatch<SetStateAction<Coord>>;
};

const popUpContext = createContext<PopupPropsType>({
  selected: false,
  setSelected: () => {},
  selectedText: "",
  setSelectedText: () => {},
  coord: {
    x: 0,
    y: 0,
  },
  setCoord: () => {},
});

const PopupContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedText, setSelectedText] = useState("");
  const [selected, setSelected] = useState(false);
  const [coord, setCoord] = useState<Coord>({
    x: 0,
    y: 0,
  });
  return (
    <popUpContext.Provider
      value={{
        selected,
        setSelected,
        selectedText,
        setSelectedText,
        setCoord,
        coord,
      }}
    >
      {children}
    </popUpContext.Provider>
  );
};

export const usePopupContext = () => {
  return useContext(popUpContext);
};

export default PopupContextProvider;
