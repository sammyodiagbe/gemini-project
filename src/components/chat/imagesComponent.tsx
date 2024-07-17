"use client";
import { useConversationContext } from "@/context/conversationContext";
import Image from "next/image";
import { FC } from "react";

type ImageCompnonentType = {
  imgBase64: string;
  id: number;
};

const ImagesComponent = () => {
  const { documentImagesData } = useConversationContext();
  if (!documentImagesData || !documentImagesData.length) return null;
  return (
    <div className=" whitespace-nowrap space-x-4 fixed bottom-0 left-0 w-screen bg-background/80 overflow-x-scroll z-[200] p-3 h-[16rem] items-center scroll-smooth hidden">
      {documentImagesData.length ? (
        documentImagesData.map((img, index) => {
          const { img_type, base_64_data } = img;
          const srcUrl = `data:image/${img_type};base64,${base_64_data}`;

          return <ImageItem imgBase64={srcUrl} id={index} key={index} />;
        })
      ) : (
        <div className=""></div>
      )}
    </div>
  );
};

const ImageItem: FC<ImageCompnonentType> = ({ imgBase64, id }) => {
  return (
    <Image
      alt={imgBase64}
      src={imgBase64}
      height={300}
      width={300}
      className="aspect-video rounded-md hover:scale-105 transition-all cursor-pointer"
    />
  );
};

export default ImagesComponent;
