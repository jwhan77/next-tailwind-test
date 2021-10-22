import ReactTooltip from "react-tooltip";

let days = Array(100).fill(false);

const Grid = () => {
  return (
    <div className="w-80 h-80 m-auto grid grid-cols-10 gap-1">
      {days.map((day, i) => (
        <>
          <div
            key={i + 1}
            className={
              day
                ? "bg-gray-500"
                : "border-2 border-gray-500 hover:border-gray-200 hover:bg-gray-200 active:bg-gray-500 active:border-gray-500"
            }
          >
            <div
              className="w-full h-full"
              data-tip="tooltip"
              data-for={`day${i + 1}`}
            ></div>
            <ReactTooltip
              id={`day${i + 1}`}
              place="bottom"
              type="dark"
              effect="solid"
            >
              <span>Day {i + 1}</span>
            </ReactTooltip>
          </div>
        </>
      ))}
    </div>
  );
};

export default Grid;
