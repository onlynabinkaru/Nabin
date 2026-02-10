import { GoogleGenAI } from "@google/genai";

export type NoteStyle =
  | "Poetic"
  | "Simple"
  | "Playful"
  | "Humorous"
  | "Empathetic";

export const generateRoseDayNote = async (
  name: string,
  style: NoteStyle,
): Promise<string> => {
  try {
    // Initialize GoogleGenAI with Vite's environment variable
    const apiKey = (import.meta.env as any).VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is not set. Please add it to your .env.local file.",
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    let styleInstruction = "";
    switch (style) {
      case "Poetic":
        styleInstruction =
          "Use high romanticism, rich metaphors, and soul-stirring language. Talk about fate, eternity, and the universe. Avoid modern slang completely.";
        break;
      case "Simple":
        styleInstruction =
          "Be extremely concise, minimalist, and pure. Use plain but deeply heartfelt words like 'always', 'only', and 'mine'. No metaphors, just raw truth.";
        break;
      case "Playful":
        styleInstruction =
          "Be cheeky, flirtatious, and lighthearted. Use cute puns or light humor about being apart. The note should make her giggle while feeling loved.";
        break;
      case "Humorous":
        styleInstruction =
          "Be funny, witty, and slightly sarcastic in a cute way. Include a clever joke about the distance or a silly pun about roses. Make her laugh out loud.";
        break;
      case "Empathetic":
        styleInstruction =
          "Be deeply understanding, supportive, and warm. Acknowledge how hard the distance can be, but emphasize your presence and love. Make her feel seen, comforted, and deeply cared for.";
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a ${style} Rose Day message for "${name}". ${styleInstruction} Mention rose won't wilt. Add 2-3 love emojis (💋❤️💖💝💕). 25-40 words.`,
      config: {
        maxOutputTokens: 80,
        temperature: 0.9,
      },
    });

    console.log("API Response:", response);

    // Handle response object - check for text property or candidates array
    let text = "";
    if (response.text) {
      text = response.text;
    } else if (response.candidates && response.candidates[0]) {
      text = response.candidates[0].content?.parts?.[0]?.text || "";
    }

    if (!text) {
      console.warn("No text received from API, using fallback");
    }

    return (
      text ||
      `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day.`
    );
  } catch (error) {
    console.error("Error generating note:", error);
    return `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day. You make everything feel like springtime. This digital rose is for you, because you deserve a beauty that never wilts.`;
  }
};

// Generate multiple candidates and have the model pick the best one.
export const generateBestRoseDayNote = async (
  name: string,
  style: NoteStyle,
): Promise<string> => {
  try {
    const apiKey = (import.meta.env as any).VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is not set. Please add it to your .env.local file.",
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    let styleInstruction = "";
    switch (style) {
      case "Poetic":
        styleInstruction =
          "Use high romanticism, rich metaphors, and soul-stirring language. Talk about fate, eternity, and the universe. Avoid modern slang completely.";
        break;
      case "Simple":
        styleInstruction =
          "Be extremely concise, minimalist, and pure. Use plain but deeply heartfelt words like 'always', 'only', and 'mine'. No metaphors, just raw truth.";
        break;
      case "Playful":
        styleInstruction =
          "Be cheeky, flirtatious, and lighthearted. Use cute puns or light humor about being apart. The note should make her giggle while feeling loved.";
        break;
      case "Humorous":
        styleInstruction =
          "Be funny, witty, and slightly sarcastic in a cute way. Include a clever joke about the distance or a silly pun about roses. Make her laugh out loud.";
        break;
      case "Empathetic":
        styleInstruction =
          "Be deeply understanding, supportive, and warm. Acknowledge how hard the distance can be, but emphasize your presence and love. Make her feel seen, comforted, and deeply cared for.";
        break;
    }

    // First: ask for 5 distinctly different candidates in one response
    const candidatesResp = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate 5 different ${style} Rose Day messages for "${name}". ${styleInstruction} Each: 25-40 words, 2-3 emojis (💋❤️💖💝💕), mentions digital rose. Label 1-5) with line breaks. All must be completely distinct.`,
      config: {
        maxOutputTokens: 400,
        temperature: 0.9,
      },
    });

    console.log("Candidates Response:", candidatesResp);

    let candidatesText = "";
    if (candidatesResp.text) {
      candidatesText = candidatesResp.text;
    } else if (candidatesResp.candidates && candidatesResp.candidates[0]) {
      candidatesText =
        candidatesResp.candidates[0].content?.parts?.[0]?.text || "";
    }

    if (!candidatesText) {
      console.warn("No candidates text received", candidatesResp);
      throw new Error("Failed to generate candidates");
    }

    // Second: ask the model to pick the single best candidate that matches the style
    const pickResp = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Candidates:\n${candidatesText}\n\nPick BEST "${style}": ${styleInstruction}\nReturn ONLY message (no numbering/explanation).`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.0,
      },
    });

    console.log("Pick Response:", pickResp);

    let bestText = "";
    if (pickResp.text) {
      bestText = pickResp.text;
    } else if (pickResp.candidates && pickResp.candidates[0]) {
      bestText = pickResp.candidates[0].content?.parts?.[0]?.text || "";
    }

    if (!bestText) {
      console.warn("No best text received", pickResp);
    }

    return (
      bestText ||
      `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day.`
    );
  } catch (error) {
    console.error("Error generating best note:", error);
    return `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day. You make everything feel like springtime. This digital rose is for you, because you deserve a beauty that never wilts.`;
  }
};
