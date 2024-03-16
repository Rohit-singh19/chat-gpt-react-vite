import { memo } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { TbMessageShare, TbMessage2Plus } from "react-icons/tb";
import PropTypes from "prop-types";

const AppBar = memo(({ setOpenSideBar }) => {
  return (
    <div className="container mx-auto px-8 py-2 md:container md:mx-auto flex items-center justify-between overflow-hidden bg-white ">
      <button
        className="text-xl block md:hidden sm:hidden"
        role="button"
        aria-expanded="false"
        aria-controls="menuList"
        onClick={() => setOpenSideBar(true)}
      >
        <BiMenuAltLeft />
      </button>

      <h1 className="text-lg font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
        Gemini{" "}
        <span className="inline-flex items-center rounded-md bg-blue-50 px-1 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-1">
          Pro
        </span>
      </h1>

      {/* for only big screen */}
      <button
        className="text-xl hidden md:block sm:block"
        role="button"
        aria-expanded="false"
        aria-controls="menuList"
        title="share chat"
      >
        <TbMessageShare />
      </button>

      {/* for small screen */}
      <button
        className="text-xl block md:hidden sm:hidden"
        role="button"
        aria-expanded="false"
        aria-controls="menuList"
        title="new chat"
      >
        <TbMessage2Plus />
      </button>
    </div>
  );
});

AppBar.displayName = "AppBar";

AppBar.propTypes = {
  setOpenSideBar: PropTypes.func.isRequired,
};

export default AppBar;
