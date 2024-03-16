import { memo, useCallback, useMemo, useState } from "react";
import Chat from "../Chat/Chat";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro-001";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const TxtToTxt = memo(() => {
  const [chatInstance, setChatInstance] = useState(null);
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

  // safety setting
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

  // init function
  const onInit = useCallback(() => {
    const newChatInstance = genAI
      .getGenerativeModel({
        model: MODEL_NAME,
      })
      .startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

    if (!newChatInstance) throw new Error("Failed to initialized the chat.");

    setChatInstance(newChatInstance);

    return newChatInstance;
  }, [genAI, generationConfig, safetySettings]);

  const onSubmit = useCallback(
    async (data) => {
      let { message } = data;

      if (!message) throw new Error("Any message is not provided!");

      const { response } = await chatInstance.sendMessage(message);

      if (!response)
        throw new Error(
          "Can't process your message. Please try something else"
        );

      // console.log("response:: ", response);
      const text = response?.text();

      if (!text)
        throw new Error("Can't process the response. It's not you, It's Us");

      return text;
    },
    [chatInstance]
  );

  return <Chat onInit={onInit} onSubmit={onSubmit} />;
});

TxtToTxt.displayName = "TxtToTxt";
export default TxtToTxt;
