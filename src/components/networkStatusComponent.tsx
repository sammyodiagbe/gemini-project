"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const NetworkStatusComponent = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateNetworkStatus = () => {
    setIsOnline(window.navigator.onLine);
  };

  useState(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
    };
  });

  return (
    <div
      className={cn("font-bold", isOnline ? "text-green-500" : "text-red-600")}
    >
      {isOnline ? "Online" : "Offline"}
    </div>
  );
};

export default NetworkStatusComponent;
