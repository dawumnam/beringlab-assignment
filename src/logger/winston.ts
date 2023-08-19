import winston from "winston";

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info", // Log only if the log level is 'info' or more severe
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: "application.log" }),
        new winston.transports.File({ filename: "error.log", level: "error" }),

        // If not in production, write to console
        ...(process.env["NODE_ENV"] !== "production"
          ? [
              new winston.transports.Console({
                format: winston.format.simple(),
              }),
            ]
          : []),
      ],
    });
  }

  // Log a message with level 'info'
  info(message: string, meta?: object) {
    this.logger.info(message, meta);
  }

  // Log a message with level 'error'
  error(message: string, meta?: object) {
    this.logger.error(message, meta);
  }
}

export default new Logger(); // Export a singleton instance
