import { FC } from "react";

type LayoutType = {
  children: React.ReactNode;
};

const HelloPageLayout: FC<LayoutType> = ({ children }) => {
  return <>{children}</>;
};

export default HelloPageLayout;
