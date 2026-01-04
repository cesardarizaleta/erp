type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = import.meta.env.DEV;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogMessage {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const formatted = this.formatMessage(level, message, data);

    if (this.isDevelopment) {
      const color = {
        info: "\x1b[32m", // Green
        warn: "\x1b[33m", // Yellow
        error: "\x1b[31m", // Red
        debug: "\x1b[34m", // Blue
      }[level];

      console.log(
        `${color}[${formatted.timestamp}] [${level.toUpperCase()}]: ${message}\x1b[0m`,
        data || ""
      );
    } else {
      // En producción podríamos enviar a Sentry, LogRocket, etc.
      if (level === "error" || level === "warn") {
        // console.error(formatted);
      }
    }
  }

  public info(message: string, data?: any) {
    this.log("info", message, data);
  }

  public warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  public error(message: string, data?: any) {
    this.log("error", message, data);
  }

  public debug(message: string, data?: any) {
    this.log("debug", message, data);
  }
}

export const logger = Logger.getInstance();
