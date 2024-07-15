import { ChangeEventHandler, FC } from "react";

type ComponentType = {
  title: string;
  level: number;
  handleLevelChange: ChangeEventHandler;
  selectedLevel: boolean;
};
const DifficultyComponent: FC<ComponentType> = ({
  title,
  level,
  handleLevelChange,
  selectedLevel,
}) => {
  return (
    <span className="block">
      <label
        htmlFor={title}
        className="flex cursor-pointer"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="radio"
          name="difficulty"
          id={title}
          className="peer/diff hidden"
          checked={selectedLevel}
          onChange={handleLevelChange}
          data-level={level}
        />
        <span className="text-start bg-background hover:bg-background/40 peer-checked/diff:bg-purple-500/75 peer-checked/diff:text-white w-full px-2 py-3 rounded-md">
          {title}( Level {level})
        </span>
      </label>
    </span>
  );
};

export default DifficultyComponent;
