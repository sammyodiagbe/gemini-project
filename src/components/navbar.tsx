"use client";
import Link from "next/link";
import NetworkStatusComponent from "./networkStatusComponent";
import ThemeToggler from "./themeToggleComponent";
import { useSearchParams } from "next/navigation";

const Navbar = () => {
  const query = useSearchParams();
  const name = query.get("name");

  return (
    <nav className="flex justify-between bg-backgroundColor text-textColor items-center p-4 h-[4.375rem] border-b-1 border-b-textColor">
      <h1 className="font-bold text-xl">
        <Link href={"/"}>Naala</Link>
      </h1>

      <div className="">
        <ul className="flex space-x-3 items-center">
          <li>
            <b>Hi, {name !== null ? name : "friend"}</b>
          </li>
          <li>
            <NetworkStatusComponent />
          </li>
          <li>
            <ThemeToggler />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
