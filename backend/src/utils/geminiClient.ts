import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Analyze resume content against job description
   * @param resumeText - Extracted text from resume
   * @param jobDescription - Job description text
   * @returns Promise with match analysis
   */
  async analyzeResumeMatch(resumeText: string, jobDescription: string) {
    try {
      const prompt = `
        As an expert HR professional, analyze the following resume against the job description and provide a detailed match analysis.

        JOB DESCRIPTION:
        ${jobDescription}

        RESUME:
        ${resumeText}

        Please provide your analysis in the following JSON format (return only valid JSON, no other text):
        {
          "matchScore": 85,
          "strengths": ["React experience", "Node.js skills", "AWS knowledge"],
          "gaps": ["Lacks Docker experience", "No PostgreSQL mentioned"],
          "assessment": "Strong candidate with relevant experience..."
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Raw Gemini response:", text);

      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
      } else {
        // Fallback response if JSON parsing fails
        return {
          matchScore: 75,
          strengths: ["Experience relevant to position"],
          gaps: ["Unable to parse detailed analysis"],
          assessment: text.trim(),
        };
      }
    } catch (error) {
      console.error("Error analyzing resume match:", error);
      throw new Error("Failed to analyze resume match");
    }
  }

  /**
   * Test the Gemini API connection
   */
  async testConnection() {
    try {
      const result = await this.model.generateContent(
        "Hello, are you working?"
      );
      const response = await result.response;
      return { success: true, response: response.text() };
    } catch (error) {
      console.error("Gemini API test failed:", error);
      return { success: false, error: error.message };
    }
  }
}

export const geminiClient = new GeminiClient();
