let days = Array(100).fill(false);

const Grid = () => {
  return (
    <div className="w-80 h-80 m-auto grid grid-cols-10 gap-1">
      {days.map((day, i) => (
        <div
          key={i + 1}
          className={
            day
              ? "bg-gray-500"
              : "border-2 border-gray-500 hover:border-gray-200 hover:bg-gray-200 active:bg-gray-500 active:border-gray-500"
          }
        ></div>
      ))}
    </div>
  );
};

export default Grid;
