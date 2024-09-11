import { LoggerInterface } from "@/domain/interfaces/logger.interface";

export class ConsoleLogger implements LoggerInterface {
  constructor(private readonly serviceName: string) {}

  log(message: string) {
    console.log(
      `INFO:${
        this.serviceName
      } : ${new Date().toLocaleTimeString()} : ${message}`
    );
  }
  warn(message: string) {
    console.log(
      `WARN:${
        this.serviceName
      } : ${new Date().toLocaleTimeString()} : ${message}`
    );
  }
  error(message: string) {
    console.log(
      `ERROR:${
        this.serviceName
      } : ${new Date().toLocaleTimeString()} : ${message}`
    );
  }
}
