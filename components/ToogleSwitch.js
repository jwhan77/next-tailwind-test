import React from "react";

const ToggleSwitch = ({ toggle, onClick, msg, className }) => {
  return (
    <div className={className}>
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        <div className="relative" onClick={onClick}>
          <input type="checkbox" id="toggle" className="sr-only" />
          <div className="block bg-gray-600 dark:bg-white w-14 h-8 rounded-full"></div>
          <div
            className={
              toggle
                ? "dot absolute left-1 top-1 bg-white dark:bg-gray-600 w-6 h-6 rounded-full transition transform translate-x-full"
                : "dot absolute left-1 top-1 bg-white dark:bg-gray-600 w-6 h-6 rounded-full transition"
            }
          ></div>
        </div>
        <div className="ml-3 text-gray-700 dark:text-white font-medium">
          {msg}
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
