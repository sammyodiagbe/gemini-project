import { FC, useEffect, useRef } from "react";

type MyPdfViewerType = {
  filePath: string;
};

const MyPdfViewer: FC<MyPdfViewerType> = ({ filePath }) => {
  const iframeRef = useRef<HTMLEmbedElement>(null);
  useEffect(() => {
    if (iframeRef.current === null) return;

    document.addEventListener("selectionchange", () => {
      console.log("check ");
      const selectedText = window.getSelection()?.toString();
      if (selectedText) {
        console.log(`you selected, `, selectedText);
      }
    });
    return () => {
      document.removeEventListener("selectionchange", () => {});
    };
  }, [iframeRef]);
  return (
    <iframe
      src={`${filePath}#toolbar=0`}
      className="w-full h-full scale-1 zoom-in-50 bg-red-300 select-none"
    ></iframe>
  );
};

export default MyPdfViewer;
