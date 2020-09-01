const { createServer, proxy } = require('aws-serverless-express');
const { init } = require('./dist/app');

const winston = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");
const AWS = require('aws-sdk');

module.exports.universal = function universal(event, context) {
    /*
    AWS.config.update({ region: 'us-east-2' });
    let logger = winston.createLogger({
        transports: [new WinstonCloudWatch({ logGroupName: 'AccessManagementStage', logStreamName: 'API' })],
        format: winston.format.json()
    });
    logger.info("Lambda Logger initialized");*/

    init().then(app => {
        const server = createServer(app);
        return proxy(server, event, context);
    });

}