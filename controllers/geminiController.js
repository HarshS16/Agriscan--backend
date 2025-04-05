import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getDiseaseInfo = async (req, res) => {
    console.log("Received request body:", req.body); // Debugging

    const { query, language } = req.body; // 👈 Accept language from frontend

    if (!query) {
        return res.status(400).json({ error: "Query is required." });
    }

    try {
        // 👇 Instruct Gemini to reply in the desired language
        const modifiedPrompt = `Please respond in ${language || "English"}:\n${query}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: modifiedPrompt,
        });

        const aiResponse = response.text;

        if (!aiResponse) throw new Error("No valid response from AI.");

        res.json({ result: aiResponse });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to fetch AI response." });
    }
};
