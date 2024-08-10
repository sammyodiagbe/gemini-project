import { FC, useEffect, useRef } from "react";

type MyPdfViewerType = {
  filePath: string;
};

const MyPdfViewer: FC<MyPdfViewerType> = ({ filePath }) => {
  const iframeRef = useRef<HTMLEmbedElement>(null);

  return (
    <iframe
      src={`${filePath}`}
      className="w-full h-full select-none resize-x"
    ></iframe>
  );
};

export default MyPdfViewer;
