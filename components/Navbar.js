import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import ToggleSwitch from "./ToogleSwitch";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [session, loading] = useSession();

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
    <nav className="flex">
      <div className="w-4/5"></div>
      <div className="w-1/5 flex justify-end">
        <div className="flex items-center justify-center text-black dark:text-white">
          {!session && (
            <>
              <button onClick={() => signIn()}>Sign in</button>
            </>
          )}
          {session && (
            <>
              <span>{session.user.name}</span>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          )}
        </div>
        <ToggleSwitch
          toggle={darkMode}
          onClick={toggleDarkMode}
          msg={"🌙"}
          className="m-4"
        />
      </div>
    </nav>
  );
};

export default Navbar;
