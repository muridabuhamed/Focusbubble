import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyBrSOFwPHYrBHRGI-fPrAAF4YCaS6gHQKI';

// Initialize the client only if the key exists, but don't crash yet if not
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCoachResponse = async (
  currentMessage: string,
  history: ChatMessage[],
  userContext: any
): Promise<string> => {
  if (!ai) {
    return "I'm having trouble connecting to my brain (API Key missing). Please check your settings.";
  }

  try {
    const modelId = "gemini-2.5-flash";
    
    // Construct a prompt that includes context
    const contextPrompt = `
      You are 'Bubble', a friendly, motivating, and slightly bubbly AI productivity coach for the FocusBubble app.
      
      User Context:
      - Name: ${userContext.name}
      - Current Streak: ${userContext.streak} days
      - Focus Goals: ${userContext.goals.join(', ')}
      
      Your goal is to encourage the user to stay focused, provide quick study tips, and help them reflect on their progress.
      Keep responses concise (under 3 sentences usually) and encouraging. Use emojis occasionally.
      
      Conversation History:
      ${history.slice(-5).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
      USER: ${currentMessage}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contextPrompt,
    });

    return response.text || "Keep pushing forward! You're doing great.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble thinking right now, but keep focusing!";
  }
};

export const getSessionInsight = async (minutes: number, distractions: number): Promise<string> => {
  if (!ai) return "Great job completing your session!";

  try {
    const prompt = `
      The user just finished a ${minutes}-minute focus session with ${distractions} distractions.
      Give them a 1-sentence personalized motivational message or insight.
      If distractions were high (>3), suggest a tip. If low, praise them.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text || "Session complete! Great work.";
  } catch (e) {
    return "Session complete! Way to go.";
  }
};