import PomodoroTimerComponent from "./pomodoroTimerComponent";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 h-[70px]">
      <h1 className="font-bold text-xl">Rafikiai</h1>

      <div className="">
        <ul className="flex space-x-3">
          <li>
            <PomodoroTimerComponent />
          </li>
          <li>
            <button className="p-2 px-4 ring-1 ring-primary rounded-md text-primary font-medium">
              Connect spotify
            </button>
          </li>
          <li>
            <div className="h-[40px] w-[40px] rounded-full bg-onBackground" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
