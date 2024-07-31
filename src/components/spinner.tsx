import { buttonIconSize } from "@/lib/utils";
import { LoaderPinwheel } from "lucide-react";

const Spinner = () => {
  return <LoaderPinwheel size={buttonIconSize} className="animate-spin mr-1" />;
};

export default Spinner;
