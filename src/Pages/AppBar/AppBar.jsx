const AppBar = () => {
  return (
    <div className="border-separate border-b container mx-auto px-8 py-2 md:container md:mx-auto flex flex-col overflow-hidden bg-white ">
      <h1 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
        Gemini{" "}
        <span className="inline-flex items-center rounded-md bg-blue-50 px-1 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-1">
          Pro
        </span>
      </h1>
    </div>
  );
};

export default AppBar;
