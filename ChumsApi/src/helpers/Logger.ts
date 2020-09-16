import { injectable } from "inversify";
import "reflect-metadata";
import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import AWS from 'aws-sdk';

@injectable()
export class WinstonLogger {
    private _logger: winston.Logger = null;
    private wc: WinstonCloudWatch;
    private pendingMessages = false;
    private logGroupName = "ChumsDev";
    private logDestination = "console";


    public error(msg: string | object) {
        if (this._logger === null) this.init("API");
        this.pendingMessages = true;
        this._logger.error(msg);
    }

    public info(msg: string | object) {
        if (this._logger === null) this.init("API");
        this.pendingMessages = true;
        this._logger.info(msg);
    }

    public log(streamName: string, level: string, msg: string | object) {
        if (this._logger === null) this.init(streamName);
        this.pendingMessages = true;
        if (level === "info") this._logger.info(msg);
        else this._logger.error(msg);
    }


    private init(streamName: string) {
        this.pendingMessages = false;
        AWS.config.update({ region: 'us-east-2' });
        if (process.env.API_ENV === "staging") { this.logGroupName = "ChumsStaging"; this.logDestination = "cloudwatch"; }
        else if (process.env.API_ENV === "prod") { this.logGroupName = "Chums"; this.logDestination = "cloudwatch"; }

        this.logDestination = "cloudwatch";

        if (this.logDestination === "cloudwatch") {
            this.wc = new WinstonCloudWatch({ logGroupName: this.logGroupName, logStreamName: streamName });
            this._logger = winston.createLogger({ transports: [this.wc], format: winston.format.json() });
        } else this._logger = winston.createLogger({ transports: [new winston.transports.Console()], format: winston.format.json() });
        this._logger.info("Logger initialized");
    }

    public flush() {
        const promise = new Promise((resolve) => {
            if (this.pendingMessages) {
                this.wc.kthxbye(() => {
                    this._logger = null;
                    resolve();
                });
            } else resolve();
        });
        return promise;
    }


}
