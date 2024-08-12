import Image from "next/image";
import { FC } from "react";

type ComponentType = {
  src: string;
  alt: string;
};
const ImageComponent: FC<ComponentType> = ({ src, alt }) => {
  return <Image src={src} alt={alt} height={800} width={800} />;
};

export default ImageComponent;
