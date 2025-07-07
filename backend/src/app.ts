import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import Routes from "./interfaces/route.interface";
import errorMiddleware from "./middlewares/error.middleware";
import { logger, stream } from "./utils/logger";
import { AuthMiddleware } from "./middlewares/auth.middleware";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    // Initialize the express app
    this.app = express();

    // Serve the QR code images before any other middleware
    this.app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    this.app = express();
    this.port = process.env.PORT || 8000;
    this.env = process.env.NODE_ENV || "development";
    this.app.use(cookieParser());
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();

    this.app.get("/", (req, res) => {
      res.send("Welcome to Harshal's Backend");
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(
        `🚀 App listening on the port ${this.port}. Current ENV ${this.env}.`
      );
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env === "production") {
      this.app.use(morgan("combined", { stream }));
    } else if (this.env === "development") {
      this.app.use(morgan("dev", { stream }));
    }

    // Set CORS to allow all origins and allow credentials
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: "2gb" }));
    this.app.use(express.urlencoded({ limit: "2gb", extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    this.app.use("/api/v1/", AuthMiddleware.authenticate);
    routes.forEach((route) => {
      this.app.use("/api/v1/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
