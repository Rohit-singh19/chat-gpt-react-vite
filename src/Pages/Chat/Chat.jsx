import { useCallback, useRef, useState, useEffect, memo } from "react";

import PropTypes from "prop-types";
import { IoSend } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { MdOutlineCopyAll } from "react-icons/md";

import { BiSolidMessageError } from "react-icons/bi";

import modelAvatar from "../../assets/model.jpg";
import userAvatar from "../../assets/user.jpg";
import ReactMarkdown from "react-markdown";

const Chat = memo(
  ({ onInit, onSubmit, isMedia, endAdornments, renderResponse }) => {
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    const [chats, setChats] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isError, setIsError] = useState(null);

    const handleSubmit = useCallback(
      async (e) => {
        try {
          e.preventDefault();
          setIsGenerating(true);
          // Access the form element directly
          const formElement = e.target;

          // Create FormData using the form element
          let formData = new FormData(formElement);

          // Convert FormData to an object
          const formDataObject = {};
          formData.forEach((value, key) => {
            formDataObject[key] = value;
          });

          if (!formDataObject["message"]) return;
          // console.log("formDataObject:", formDataObject);

          setChats((prev) => [
            ...prev,
            {
              role: "user",
              parts: [
                {
                  text: formDataObject["message"],
                },
              ],
            },
          ]);

          formElement.reset();

          let text = await onSubmit?.(formDataObject);

          setChats((prev) => [
            ...prev,
            {
              role: "model",
              parts: [
                {
                  text: text || "Something went wrong!",
                },
              ],
            },
          ]);
        } catch (err) {
          console.log("error :::", err);
          setIsError(err?.message || "Something went wrong!");
        } finally {
          setIsGenerating(false);
        }
      },
      [onSubmit]
    );

    // copy to clipboard
    const handleCopy = useCallback(async (text) => {
      try {
        if ("clipboard" in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document?.execCommand("copy", true, text);
        }
      } catch (err) {
        console.log("error on copying", err);
      }
    }, []);

    // render Chat message
    const renderChat = useCallback(
      (chat, chatIndex) => {
        const { role, parts } = chat;

        if (renderResponse) {
          return renderResponse(chat, chatIndex, handleCopy);
        }

        return (
          <div
            key={chatIndex}
            className={`p-2 rounded-xl mb-4 ${
              chat.role === "user" ? "bg-white " : "bg-[#f0faf9] text-[#1B1B20]"
            }`}
          >
            <div className="flex gap-2 mb-2 justify-between">
              <div className="flex gap-2 mb-2">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src={role === "user" ? userAvatar : modelAvatar}
                  alt={`${role}-${chatIndex}`}
                />
                <span className="font-semibold">
                  {role === "user" ? "You" : "Chat Bot"}
                </span>
              </div>
              {role !== "user" && (
                <div>
                  <button
                    title="copy response"
                    className="flex gap-1 items-center justify-between p-2"
                    onClick={() => handleCopy(parts[0]?.text)}
                  >
                    <MdOutlineCopyAll />
                  </button>
                </div>
              )}
            </div>
            {parts.map((part, i) => (
              <div className="pl-8" key={i}>
                <ReactMarkdown className="markdown-container">
                  {part["text"]}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        );
      },
      [handleCopy, renderResponse]
    );

    useEffect(() => {
      try {
        onInit?.();
      } catch (err) {
        console.log("Failed to initialized the chat. ", err);
        setIsError("Failed to initialized the chat.");
      }
    }, [onInit]);

    useEffect(() => {
      // Scroll to the bottom of the chat container when chats change
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      // Focus the input field after the component re-renders
      inputRef.current.focus();
    }, [chats]);

    return (
      <div className="container mx-auto px-4 md:container md:mx-auto flex flex-col h-full overflow-hidden bg-white">
        {/* Chat messages with scrollable area */}
        <div
          ref={chatContainerRef}
          className="transition-all flex-grow overflow-y-auto p-4"
        >
          {chats.length === 0 && (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <h1 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
                Gemini{" "}
                <span className="inline-flex items-center rounded-md bg-blue-50 px-1 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-1">
                  Pro
                </span>
              </h1>
              <h2 className="mt-2 flex items-center text-xl font-semibold ">
                How can I help you today?
              </h2>
            </div>
          )}
          {chats.map((chat, i) => renderChat(chat, i))}

          {/* Show loader for waiting time */}
          {isGenerating && (
            <div className="pl-8">
              <div className="animate-spin w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full border-r-2"></div>
            </div>
          )}

          {isError && (
            <div className="alert-container">
              <div className="alert-error bg-red-200  p-4 rounded-md shadow-md flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-red">
                    <BiSolidMessageError className="text-red" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm leading-5">
                      {isError || "Something went wrong!"}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsError(null)}>
                  <IoIosClose />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input area at the bottom with Send button */}
        <form onSubmit={handleSubmit} className="flex items-center px-2 gap-1">
          <div className="flex flex-grow relative border rounded ">
            <input
              ref={inputRef}
              type="text"
              name="message"
              className="flex-grow p-2 bg-transparent focus:border-none focus-visible:outline-none"
              placeholder="Type your message..."
              disabled={isGenerating}
              autoComplete="off"
            />

            {/* Render endAdornments inside the input */}
            {endAdornments && (
              <div className="flex items-center mr-1">{endAdornments()}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-5 rounded disabled:bg-gray-400 disabled:text-white flex-shrink-0"
            disabled={isGenerating}
          >
            <IoSend />
          </button>
        </form>
        <p className="text-xs p-2 truncate font-medium text-gray-500 m-auto max-w-full">
          This app uses external APIs for better user experience, with responses
          directly from them.
        </p>
      </div>
    );
  }
);

Chat.propTypes = {
  onInit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isMedia: PropTypes.bool,
  endAdornments: PropTypes.func,
  renderResponse: PropTypes.func,
};

Chat.defaultProps = {
  isMedia: false,
  endAdornments: null,
  renderResponse: null,
};

Chat.displayName = "Chat";
export default Chat;
