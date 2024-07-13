import Link from "next/link";
import NetworkStatusComponent from "./networkStatusComponent";
import ThemeToggler from "./themeToggleComponent";

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-backgroundColor text-textColor items-center p-4 h-[4.375rem] border-b-1 border-b-textColor">
      <h1 className="font-bold text-xl">
        <Link href={"/"}>Rafikiai</Link>
      </h1>

      <div className="">
        <ul className="flex space-x-3 items-center">
          <li>
            <b>Hi, Samson</b>
          </li>
          <li>
            <NetworkStatusComponent />
          </li>
          <li>
            <ThemeToggler />
          </li>
          <li>
            <div className="h-[2.5rem] w-[2.5rem] rounded-full bg-onBackground" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
