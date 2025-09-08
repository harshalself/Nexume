import fs from "fs";

// logs dir
const logDir = __dirname + "/../logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Simple console-based logger without external dependencies
const logger = {
  info: (message: string, ...args: any[]) => {
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
    console.log(`${timestamp} INFO: ${message}`, ...args);

    // Also write to file
    try {
      const logFile = `${logDir}/info/${
        new Date().toISOString().split("T")[0]
      }.log`;
      const logDirPath = `${logDir}/info`;
      if (!fs.existsSync(logDirPath)) {
        fs.mkdirSync(logDirPath, { recursive: true });
      }
      fs.appendFileSync(logFile, `${timestamp} INFO: ${message}\n`);
    } catch (error) {
      // Ignore file write errors in production
    }
  },

  error: (message: string, ...args: any[]) => {
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
    console.error(`${timestamp} ERROR: ${message}`, ...args);

    // Also write to file
    try {
      const logFile = `${logDir}/error/${
        new Date().toISOString().split("T")[0]
      }.error.log`;
      const logDirPath = `${logDir}/error`;
      if (!fs.existsSync(logDirPath)) {
        fs.mkdirSync(logDirPath, { recursive: true });
      }
      fs.appendFileSync(logFile, `${timestamp} ERROR: ${message}\n`);
    } catch (error) {
      // Ignore file write errors in production
    }
  },

  warn: (message: string, ...args: any[]) => {
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
    console.warn(`${timestamp} WARN: ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
    console.debug(`${timestamp} DEBUG: ${message}`, ...args);
  },
};

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { logger, stream };
