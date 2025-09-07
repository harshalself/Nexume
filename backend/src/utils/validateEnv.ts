import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    JWT_SECRET: str(),
    PORT: port(),
    SUPABASE_URL: str(),
    SUPABASE_SERVICE_ROLE_KEY: str(),
    GEMINI_API_KEY: str(),
  });
};

export default validateEnv;
