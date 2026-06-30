require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

class AIService {
    // Common function for Gemini requests
    static async generateResponse(prompt) {
        if (!ai) {
            console.warn('GEMINI_API_KEY is not configured. Returning a fallback response.');
            return 'AI response unavailable. Configure GEMINI_API_KEY for live analysis.';
        }

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            return response.text;
        } catch (error) {
            console.error('Gemini Error:', error.message);
            throw new Error('Failed to generate AI response.');
        }
    }

    // Generate Meeting Summary
    static async generateSummary(transcript) {
        const prompt = `
You are an AI Meeting Assistant.

Read the following meeting transcript and generate a professional meeting summary.

Include:
- Meeting Objective
- Main Discussion Points
- Important Decisions
- Overall Outcome

Transcript:
${transcript}
`;

        return await this.generateResponse(prompt);
    }

    // Extract Action Items
    static async extractActionItems(transcript) {
        const prompt = `
You are an AI Meeting Assistant.

Read the transcript and extract all action items.

For each action item provide:
- Task
- Responsible Person (if mentioned)
- Deadline (if mentioned)

Return as a bullet list.

Transcript:
${transcript}
`;

        return await this.generateResponse(prompt);
    }

    // Detect Decisions
    static async detectDecisions(transcript) {
        const prompt = `
You are an AI Meeting Assistant.

Read the transcript and identify all important decisions made during the meeting.

Return only the decisions as bullet points.

Transcript:
${transcript}
`;

        return await this.generateResponse(prompt);
    }
}

module.exports = AIService;