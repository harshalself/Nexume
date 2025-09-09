import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  /**
   * Lazy initialization of Gemini client
   */
  private initializeClient() {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
      }

      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
      } catch (error) {
        console.error("Failed to initialize Gemini client:", error);
        throw new Error(
          `Gemini client initialization failed: ${error.message}`
        );
      }
    }
  }

  /**
   * Analyze resume content against job description
   * @param resumeText - Extracted text from resume
   * @param jobDescription - Job description text
   * @returns Promise with match analysis
   */
  async analyzeResumeMatch(resumeText: string, jobDescription: string) {
    try {
      console.log("🔧 [GEMINI] Starting analyzeResumeMatch...");
      console.log(
        `🔧 [GEMINI] Resume text length: ${resumeText?.length || 0} chars`
      );
      console.log(
        `🔧 [GEMINI] Job description length: ${
          jobDescription?.length || 0
        } chars`
      );

      // Validate inputs
      if (!resumeText || resumeText.length < 10) {
        throw new Error("Resume text is too short or empty");
      }
      if (!jobDescription || jobDescription.length < 10) {
        throw new Error("Job description is too short or empty");
      }

      this.initializeClient();
      console.log("🔧 [GEMINI] Client initialized successfully");

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

      console.log("🔧 [GEMINI] Sending request to Gemini API...");
      const result = await this.model!.generateContent(prompt);
      console.log("🔧 [GEMINI] Got response from Gemini API");

      const response = await result.response;
      const text = response.text();

      console.log("🔧 [GEMINI] Raw Gemini response:", text);

      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log("🔧 [GEMINI] JSON found in response, parsing...");
        try {
          const analysis = JSON.parse(jsonMatch[0]);
          console.log("🔧 [GEMINI] Successfully parsed JSON response");
          console.log("🔧 [GEMINI] Match score:", analysis.matchScore);
          return analysis;
        } catch (parseError) {
          console.error("🔧 [GEMINI] JSON parsing failed:", parseError);
          throw new Error(`JSON parsing failed: ${parseError.message}`);
        }
      } else {
        console.log("🔧 [GEMINI] No JSON found in response, using fallback");
        // Fallback response if JSON parsing fails
        return {
          matchScore: 75,
          strengths: ["Experience relevant to position"],
          gaps: ["Unable to parse detailed analysis"],
          assessment: text.trim(),
        };
      }
    } catch (error) {
      console.error("🔧 [GEMINI] Error analyzing resume match:", error);
      console.error("🔧 [GEMINI] Error type:", error.constructor.name);
      console.error("🔧 [GEMINI] Error message:", error.message);
      console.error("🔧 [GEMINI] Error stack:", error.stack);
      throw new Error(`Failed to analyze resume match: ${error.message}`);
    }
  }

  /**
   * Test the Gemini API connection
   */
  async testConnection() {
    try {
      this.initializeClient();

      const result = await this.model!.generateContent(
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
