import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import ToggleSwitch from "./ToogleSwitch";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [session] = useSession();

  useEffect(() => {
    function setupMode() {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      }
    }

    setupMode();

    return () => {};
  }, []);

  const toggleDarkMode = (e) => {
    e.preventDefault();
    localStorage.theme = darkMode ? "light" : "dark";
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="flex p-6 bg-gray-200 text-gray-700">
      <div className="w-2/3">
        <div className="font-bold text-xl">
          <p>#100DaysOfCode</p>
          <p>Challenge tracking</p>
        </div>
      </div>
      <div className="w-1/3 flex justify-end">
        <div className="flex items-center justify-center dark:text-white">
          {!session && (
            <>
              <button
                className="font-semibold"
                onClick={() => signIn("github")}
              >
                Sign in
              </button>
            </>
          )}
          {session && (
            <>
              <span
                onClick={() => signOut()}
                className="font-semibold cursor-pointer"
              >
                {session.user && session.user.name}
              </span>
              {/* <button onClick={() => signOut()}>Sign out</button> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
