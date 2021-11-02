import ReactTooltip from "react-tooltip";

let days = Array(100).fill(false);

const Grid = (props) => {
  return (
    <div className="w-80 h-80 m-auto grid grid-cols-10 gap-1">
      {days.map((day, i) => (
        <div
          key={i + 1}
          className={
            props.days[i + 1].complete
              ? "bg-gray-500 rounded"
              : "border-2 border-gray-500 hover:border-gray-200 hover:bg-gray-200 active:bg-gray-500 active:border-gray-500 border-rad rounded"
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
            <p>Day {i + 1}</p>
            <p>{props.days[i + 1].date}</p>
          </ReactTooltip>
        </div>
      ))}
    </div>
  );
};

export default Grid;
