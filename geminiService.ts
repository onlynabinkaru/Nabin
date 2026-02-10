export type NoteStyle =
  | "Poetic"
  | "Simple"
  | "Playful"
  | "Humorous"
  | "Empathetic";

const TOGETHER_API_URL = "https://api.together.xyz/v1/completions";

const callTogetherAI = async (prompt: string): Promise<string> => {
  const apiKey = (import.meta.env as any).VITE_TOGETHER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_TOGETHER_API_KEY is not set. Please add it to your .env.local file.",
    );
  }

  try {
    const response = await fetch(TOGETHER_API_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "meta-llama/Llama-2-7b-chat-hf",
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.7,
        repetition_penalty: 1,
      }),
    });

    const result = await response.json();
    console.log("Together AI Response:", result);

    if (result.output?.choices?.[0]?.text) {
      let text = result.output.choices[0].text.trim();
      return text;
    }

    throw new Error("Invalid response from Together AI");
  } catch (error) {
    console.error("Together AI Error:", error);
    return "";
  }
};

export const generateRoseDayNote = async (
  name: string,
  style: NoteStyle,
): Promise<string> => {
  try {
    let styleInstruction = "";
    switch (style) {
      case "Poetic":
        styleInstruction =
          "romantic, metaphorical, soul-stirring, about fate and eternity";
        break;
      case "Simple":
        styleInstruction = "concise, minimalist, pure, heartfelt";
        break;
      case "Playful":
        styleInstruction = "cheeky, flirtatious, lighthearted, cute puns";
        break;
      case "Humorous":
        styleInstruction =
          "funny, witty, sarcastic in a cute way, clever jokes";
        break;
      case "Empathetic":
        styleInstruction =
          "deeply understanding, supportive, warm, acknowledging distance";
        break;
    }

    const prompt = `Write a ${style} Rose Day love note for ${name}. Style: ${styleInstruction}. Include the rose is digital and won't wilt. Add 2-3 love emojis (💋❤️💖). Keep it 25-40 words. Message:`;

    const text = await callTogetherAI(prompt);
    return (
      text ||
      `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day.`
    );
  } catch (error) {
    console.error("Error generating note:", error);
    return `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day. You make everything feel like springtime. This digital rose is for you, because you deserve a beauty that never wilts.`;
  }
};

// Generate multiple candidates and pick the best one
export const generateBestRoseDayNote = async (
  name: string,
  style: NoteStyle,
): Promise<string> => {
  try {
    let styleInstruction = "";
    switch (style) {
      case "Poetic":
        styleInstruction =
          "romantic, metaphorical, soul-stirring, about fate and eternity";
        break;
      case "Simple":
        styleInstruction = "concise, minimalist, pure, heartfelt";
        break;
      case "Playful":
        styleInstruction = "cheeky, flirtatious, lighthearted, cute puns";
        break;
      case "Humorous":
        styleInstruction =
          "funny, witty, sarcastic in a cute way, clever jokes";
        break;
      case "Empathetic":
        styleInstruction =
          "deeply understanding, supportive, warm, acknowledging distance";
        break;
    }

    // Generate 3 candidates in one call
    const candidatesPrompt = `Write 3 different ${style} Rose Day messages for ${name}. Style: ${styleInstruction}. Each should mention the digital rose won't wilt, have 2-3 love emojis (💋❤️💖), be 25-40 words, and sound completely different. Format as: 1) ... 2) ... 3) ...`;

    const candidatesText = await callTogetherAI(candidatesPrompt);
    console.log("Candidates:", candidatesText);

    if (!candidatesText) {
      throw new Error("Failed to generate candidates");
    }

    // Pick the best one
    const pickPrompt = `Below are 3 Rose Day messages:\n${candidatesText}\n\nChoose the BEST one that matches "${style}" style: ${styleInstruction}. Return ONLY that message text, nothing else.`;

    const bestText = await callTogetherAI(pickPrompt);
    console.log("Best:", bestText);

    return (
      bestText ||
      `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day.`
    );
  } catch (error) {
    console.error("Error generating best note:", error);
    return `My dear ${name}, just like this rose, my feelings for you grow more beautiful every single day. You make everything feel like springtime. This digital rose is for you, because you deserve a beauty that never wilts.`;
  }
};
