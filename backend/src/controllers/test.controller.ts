import { Request, Response, NextFunction } from "express";
import { geminiClient } from "../utils/geminiClient";
import HttpException from "../exceptions/HttpException";

export class TestController {
  // Test Gemini API connection
  public testGemini = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await geminiClient.testConnection();
      res.status(200).json({
        message: "Gemini API test completed",
        ...result,
      });
    } catch (error) {
      next(new HttpException(500, "Failed to test Gemini API"));
    }
  };

  // Test resume analysis (with dummy data)
  public testResumeAnalysis = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dummyResume = `
        John Doe
        Software Engineer
        Email: john.doe@email.com
        
        Experience:
        - 5 years of React development
        - 3 years of Node.js backend development
        - Experience with PostgreSQL and MongoDB
        - Worked with AWS and Docker
        
        Skills: JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker
      `;

      const dummyJobDescription = `
        Senior Full Stack Developer
        
        Requirements:
        - 4+ years of React experience
        - Backend development with Node.js
        - Database experience (PostgreSQL preferred)
        - Cloud platform experience (AWS)
        - Docker knowledge is a plus
      `;

      const analysis = await geminiClient.analyzeResumeMatch(
        dummyResume,
        dummyJobDescription
      );

      res.status(200).json({
        message: "Resume analysis test completed",
        analysis,
      });
    } catch (error) {
      next(new HttpException(500, "Failed to analyze resume"));
    }
  };
}
