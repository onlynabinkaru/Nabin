import { GoogleGenAI } from "@google/genai";

const testGeminiAPI = async () => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ ERROR: VITE_GEMINI_API_KEY is NOT set!");
    console.log("📝 Please create a .env.local file with:");
    console.log("VITE_GEMINI_API_KEY=your_api_key_here");
    process.exit(1);
  }

  console.log("✅ API Key found:", apiKey.substring(0, 10) + "...");

  try {
    const ai = new GoogleGenAI({ apiKey });

    console.log("🔄 Testing API connection...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Say 'Hello! Real AI is working!' in exactly those words.",
      config: {
        maxOutputTokens: 50,
        temperature: 0,
      },
    });

    console.log("📝 Response object:", response);

    let text = "";
    if (response.text) {
      text = response.text;
    } else if (response.candidates && response.candidates[0]) {
      text = response.candidates[0].content?.parts?.[0]?.text || "";
    }

    if (text) {
      console.log("✅ SUCCESS! Real AI is working:");
      console.log("📨 Response:", text);
    } else {
      console.error("❌ ERROR: No response from API");
      console.log("Full response:", JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error("❌ API Error:", error);
  }
};

testGeminiAPI();
