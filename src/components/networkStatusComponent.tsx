"use client";

import { useState } from "react";

const NetworkStatusComponent = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
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
    <div className="">you are currently {isOnline ? "Online" : "Offline"}</div>
  );
};

export default NetworkStatusComponent;
