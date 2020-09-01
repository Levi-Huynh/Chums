import { injectable } from "inversify";
import "reflect-metadata";
import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import AWS from 'aws-sdk';

@injectable()
export class WinstonLogger {
  private _logger: winston.Logger;

  public get logger(): winston.Logger {
    return this._logger;
  }

  constructor() {
    AWS.config.update({ region: 'us-east-2' });
    if (process.env.NODE_ENV === "dev") this._logger = winston.createLogger({ transports: [new winston.transports.Console()], format: winston.format.json() });
    else if (process.env.NODE_ENV === "staging") {
      const wc = new WinstonCloudWatch({ logGroupName: 'ChumsStaging', logStreamName: 'API' });
      this._logger = winston.createLogger({ transports: [wc], format: winston.format.json() });
    }
    else if (process.env.NODE_ENV === "prod") {
      const wc = new WinstonCloudWatch({ logGroupName: 'Chums', logStreamName: 'API' });
      this._logger = winston.createLogger({ transports: [wc], format: winston.format.json() });
    }
    this._logger.info("Logger initialized");
  }
}
