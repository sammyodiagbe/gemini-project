import { useToastContext } from "@/context/toastContext";
import { ToastType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FC } from "react";

type ComponentType = {
  toast: ToastType;
};
const variants = {
  show: { x: "0" },
  initial: { x: "100%" },
  exit: { x: "100%" },
};

const Toast: FC<ComponentType> = ({ toast }) => {
  const { title, body, type } = toast;
  const { removeToast, toasts } = useToastContext();
  const check = toasts.includes(toast);
  return (
    <>
      {check && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="show"
          exit="exit"
          className={cn(
            "p-2 rounded-md relative",
            type === "success" && "bg-green-500",
            type === "error" && "bg-red-500"
          )}
        >
          <h1 className="text-md mb-2">{title}</h1>
          <p>{body}</p>
          <button
            className="absolute right-2 top-2"
            onClick={() => removeToast(toast)}
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </>
  );
};

export default Toast;
