import { Router } from "express";
import Route from "../interfaces/route.interface";
import { TestController } from "../controllers/test.controller";

class TestRoute implements Route {
  public path = "/test";
  public router = Router();
  public testController = new TestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Test Gemini API connection
    this.router.get(`${this.path}/gemini`, this.testController.testGemini);

    // Test resume analysis with dummy data
    this.router.get(
      `${this.path}/resume-analysis`,
      this.testController.testResumeAnalysis
    );
  }
}

export default TestRoute;
