import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import { IoSend } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { MdOutlineCopyAll } from "react-icons/md";

import { BiSolidMessageError } from "react-icons/bi";

import modelAvatar from "../../assets/model.jpg";
import userAvatar from "../../assets/user.jpg";
import ReactMarkdown from "react-markdown";

const MODEL_NAME = "gemini-1.0-pro-001";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Chat = () => {
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatInstance, setChatInstance] = useState(null);
  const [isError, setIsError] = useState(null);

  const genAI = useMemo(() => new GoogleGenerativeAI(API_KEY), []);

  const generationConfig = useMemo(
    () => ({
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    }),
    []
  );

  const safetySettings = useMemo(
    () => [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
    []
  );

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

        if (!chatInstance) throw new Error("Chat is not initialized");

        const { response } = await chatInstance.sendMessage(
          formDataObject["message"]
        );

        if (!response)
          throw new Error(
            "Can't process your message. Please try something else"
          );

        // console.log("response:: ", response);
        const text = response?.text();

        if (!text)
          throw new Error("Can't process the response. It's not you, It's Us");

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
    [chatInstance]
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
    [handleCopy]
  );

  useEffect(() => {
    try {
      const init = async () => {
        const newChatInstance = await genAI
          .getGenerativeModel({
            model: MODEL_NAME,
          })
          .startChat({
            generationConfig,
            safetySettings,
            history: [],
          });

        setChatInstance(newChatInstance);
      };

      init();
    } catch (err) {
      console.log("Failed to initialized the chat. ", err);
      setIsError("Failed to initialized the chat.");
    }
  }, [genAI, generationConfig, safetySettings]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when chats change
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
      <form onSubmit={handleSubmit} className="flex items-center p-4">
        <input
          ref={inputRef}
          type="text"
          name="message"
          className="flex-grow border rounded p-2 mr-2"
          placeholder="Type your message..."
          disabled={isGenerating}
          autoComplete="off"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-5 rounded disabled:bg-gray-400 disabled:text-white flex-shrink-0"
          disabled={isGenerating}
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
};

export default Chat;
