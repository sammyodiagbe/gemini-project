import PomodoroTimerComponent from "./pomodoroTimerComponent";

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-backgroundColor text-textColor items-center p-4 h-[70px]">
      <h1 className="font-bold text-xl">Rafikiai</h1>

      <div className="">
        <ul className="flex space-x-3 items-center">
          <li>
            <PomodoroTimerComponent />
          </li>
          <li>
            <b>Hi, Samson</b>
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
