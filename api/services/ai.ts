import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.ts";
import { type Message } from "../types/types.ts";
import { SYSTEM_MESSAGE } from "../config/constants.ts";

const getResponse = async (messages: Message[]) => {
  const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
  });

  const tools = [
    {
      googleSearch: {},
    },
  ];

  const config: {
    tools: { googleSearch: {} }[];
    systemInstruction: { text: string }[];
  } = {
    tools,
    systemInstruction: [
      {
        text: SYSTEM_MESSAGE,
      },
    ],
  };

  const model = "gemini-2.0-flash";

  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents: formattedMessages,
  });

  let finalResponse = "";

  for await (const chunk of response) {
    if (chunk.text) {
      finalResponse += chunk.text;
    }
  }

  return finalResponse || "Sorry, I am busy right now - try again later.";
};

export { getResponse };
