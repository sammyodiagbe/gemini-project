import { FC } from "react";

type ComponentType = {
  title: string;
};
const DifficultyComponent: FC<ComponentType> = ({ title }) => {
  return (
    <span className="block">
      <label htmlFor={title} className="flex cursor-pointer">
        <input
          type="radio"
          name="difficulty"
          id={title}
          className="peer/diff hidden"
          checked
        />
        <span className="text-start bg-background hover:bg-background/40 peer-checked/diff:bg-purple-500/75 peer-checked/diff:text-white w-full px-2 py-3 rounded-md">
          {title}
        </span>
      </label>
    </span>
  );
};

export default DifficultyComponent;
