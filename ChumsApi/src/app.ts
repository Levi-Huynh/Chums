import dotenv from "dotenv";
import bodyParser from "body-parser";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { bindings } from "./inversify.config";
import express from "express";
import { CustomAuthProvider } from "./auth";
import cors from "cors"
import AWS from "aws-sdk"
import winston from "winston"
import WinstonCloudWatch from "winston-cloudwatch"

export const init = async () => {
    /*
    AWS.config.update({ region: 'us-east-2' });
    const logger = winston.createLogger({
        transports: [new WinstonCloudWatch({ logGroupName: 'AccessManagementStage', logStreamName: 'API' })],
        format: winston.format.json()
    });
    logger.info("App Logger initialized");*/

    dotenv.config();
    const container = new Container();
    await container.loadAsync(bindings);
    const app = new InversifyExpressServer(container, null, null, null, CustomAuthProvider);

    const configFunction = (expApp: express.Application) => {
        expApp.use(bodyParser.urlencoded({ extended: true }));
        expApp.use(bodyParser.json());
        expApp.use(cors())
    };

    const server = app.setConfig(configFunction).build();
    return server;
}
