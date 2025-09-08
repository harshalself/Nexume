import "dotenv/config";
import App from "./app";
import UserRoute from "./routes/user.route";
import JobDescriptionRoute from "./routes/jobDescription.route";
import ResumeRoute from "./routes/resume.route";
import TestRoute from "./routes/test.route";
import EnhancedMatchingRoute from "./routes/enhancedMatching.route";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([
  new UserRoute(),
  new JobDescriptionRoute(),
  new ResumeRoute(),
  new TestRoute(),
  new EnhancedMatchingRoute(),
]);

app.listen();
