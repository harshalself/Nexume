import "dotenv/config";
import App from "./app";
import UserRoute from "./routes/user.route";
import JobDescriptionRoute from "./routes/jobDescription.route";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new UserRoute(), new JobDescriptionRoute()]);

app.listen();
