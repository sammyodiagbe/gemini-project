import { FC, Fragment } from "react";

type LayoutType = {
  children: React.ReactNode;
  title: "Naala is here to help";
};

const PageLayout: FC<LayoutType> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export default PageLayout;
