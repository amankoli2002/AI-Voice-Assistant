import { COHERE_AI_API_KEY } from "../constants";

interface Message {
  role: "USER" | "CHATBOT";
  message: string;
}

export const sendToCohere = async ( chat_history: Message[], inputText: string ) => {
  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus",
        chat_history,
        message: inputText
      }),
    });

    let data = await response.json();

    if (response.ok) {
      return data.text.trim();
    } else {
      console.log("Cohere API Error:", data);
      return "Something went wrong.";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return "Network error";
  }
};
