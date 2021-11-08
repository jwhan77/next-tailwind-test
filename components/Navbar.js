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

    function setupDropdownToggle() {
      const nextElement = document.getElementById("__next");
      nextElement.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          const dropdownElement = document.getElementById("user-dropdown");
          if (
            ((e.target.id && e.target.id !== "username") || !e.target.id) &&
            !dropdownElement.classList.contains("hidden")
          ) {
            dropdownElement.classList.add("hidden");
          }
        } catch (e) {
          console.log(e);
        }
      });
    }

    setupMode();
    setupDropdownToggle();

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

  const toggleDropdown = () => {
    const dropdownElement = document.getElementById("user-dropdown");
    if (dropdownElement.classList.contains("hidden")) {
      dropdownElement.classList.remove("hidden");
    } else {
      dropdownElement.classList.add("hidden");
    }
  };

  return (
    <nav className="flex p-6 bg-gray-200 text-gray-700 fixed w-screen h-28">
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
                id="username"
                className="font-semibold cursor-pointer"
                onClick={toggleDropdown}
              >
                {session.user && session.user.name}
              </span>
              <div className="w-8"></div>
              <div
                id="user-dropdown"
                className="absolute border-gray-300 border rounded-xl bg-gray-200 w-36 -mb-40 right-5 p-2 hidden"
              >
                <ToggleSwitch
                  toggle={darkMode}
                  onClick={toggleDarkMode}
                  msg={"🌙"}
                  className="m-4"
                />
                <hr className="h-0.5 bg-gray-300" />
                <div
                  onClick={() => signOut()}
                  className="text-center mt-3 mb-1 cursor-pointer"
                >
                  Sign out
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
