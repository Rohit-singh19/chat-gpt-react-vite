import { useMemo } from "react";
import { MdOutlineChat, MdClose } from "react-icons/md";
import { MdOutlineVideoChat } from "react-icons/md";
import { AiOutlineGithub } from "react-icons/ai";
import { NavLink } from "react-router-dom";
// import logo from "../../assets/ai-logo.png";
import { TbMessage2Plus } from "react-icons/tb";
import PropTypes from "prop-types";

const Sidebar = ({ openSideBar, setOpenSideBar }) => {
  const menuItems = useMemo(
    () => [
      {
        name: "Chat (text-to-text)",
        Icon: MdOutlineChat,
        route: "",
        id: "text2text",
      },
      {
        name: "Multi media chat",
        Icon: MdOutlineVideoChat,
        route: "media2txt",
        id: "multimedia",
      },
    ],
    []
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black opacity-50 z-1 ${
          openSideBar ? "block" : "hidden"
        }`}
        onClick={() => setOpenSideBar(false)}
      ></div>
      <div
        className={`px-4 py-2 fixed md:relative sm:relative flex flex-col items-start gap-2 w-[260px]  bg-gray-100 transition-transform ${
          openSideBar
            ? "top-0 bottom-0 h-full translate-x-0"
            : "-translate-x-full sm:translate-x-0 md:translate-x-0"
        } duration-150`}
      >
        {/* close menu btn for mobile */}
        <button
          className={`text-xl md:hidden sm:hidden absolute left-full p-2 ml-3 border-solid border-2 border-white text-white ${
            openSideBar ? "inline-block" : "hidden"
          } `}
          role="button"
          aria-expanded="false"
          aria-controls="menuList"
          onClick={() => setOpenSideBar(false)}
        >
          <MdClose />
        </button>

        {/* <div className="h-[40px] relative">
          <img src={logo} className="w-fit-content h-full" alt="logo" />
          <em className="absolute bottom-0 left-full text-nowrap indent-1">
            by Rohit
          </em>
        </div> */}

        <button
          className={`flex items-center px-4 py-2 cursor-pointer text-sm rounded w-full ${"hover:bg-gray-200"}`}
        >
          <span className="mr-2">
            <TbMessage2Plus />
          </span>
          <span className="max-w-full truncate">New Chat</span>
        </button>

        <ul className="grow pt-2 w-full">
          {menuItems.map(({ id, Icon, route, name }) => (
            <NavLink
              key={id}
              to={route}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 cursor-pointer text-sm rounded mb-2  ${
                  isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`
              }
            >
              <span className="mr-2">{Icon && <Icon />}</span>
              <span className="max-w-full truncate">{name && name}</span>
            </NavLink>
          ))}
        </ul>
        <NavLink
          to={"//https://github.com/Rohit-singh19/chat-gpt-react-vite/fork"}
          className={`w-full flex items-center px-4 py-2 cursor-pointer text-base rounded mb-2 hover:bg-slate-100`}
        >
          <span className="mr-2">
            <AiOutlineGithub />
          </span>
          <span className="max-w-full truncate">Fork on GitHub</span>
        </NavLink>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  setOpenSideBar: PropTypes.func.isRequired,
  openSideBar: PropTypes.bool.isRequired,
};

export default Sidebar;
