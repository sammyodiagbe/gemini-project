import { useState } from "react";

const HelloPage = () => {
  const [name, setName] = useState("");
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="">
        <h1>Hello there, I am Naala, here to make your study better</h1>
        <h1>What can i call you</h1>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
    </div>
  );
};

export default HelloPage;
