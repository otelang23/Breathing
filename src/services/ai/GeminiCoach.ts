import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Technique } from "../../types";

export class GeminiCoach {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateSession(hr: number, hrv: number, goal: string): Promise<Technique> {
        // Use gemini-1.5-flash for speed and better JSON adherence
        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const prompt = `
        You are an expert breathwork physiologist. 
        Create a custom breathing technique based on the following biometric data:
        - Heart Rate: ${hr} bpm
        - HRV: ${hrv} ms
        - User Goal: ${goal}

        Return a JSON object with this exact structure (no markdown, just raw JSON):
        {
            "id": "ai_generated_${Date.now()}",
            "name": "Creative Name based on goal",
            "description": "Short scientific description of why this pattern helps",
            "benefits": ["benefit 1", "benefit 2"],
            "steps": [
                { "action": "Inhale", "duration": 4, "text": "Inhale deeply" },
                { "action": "Hold", "duration": 4, "text": "Hold breath" },
                { "action": "Exhale", "duration": 4, "text": "Exhale slowly" }
            ],
            "audioProfile": "calm"
        }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // flash with json mode usually returns clean json, but strictly parsing is good
            const technique = JSON.parse(text);
            return technique;
        } catch (error) {
            console.error("Gemini API Error:", error);
            // Re-throw with more detail if possible, otherwise generic
            throw error;
        }
    }
}
