import { inject } from "inversify";
import { BaseHttpController } from "inversify-express-utils";
import { TYPES } from "../constants";
import { Repositories } from "../repositories";
import express from "express";
import { WinstonLogger } from "../logger";
import { AuthenticatedUser } from '../auth'


export class CustomBaseController extends BaseHttpController {

    public repositories: Repositories;
    public logger: WinstonLogger;

    constructor(@inject(TYPES.Repositories) repositories: Repositories, @inject(TYPES.LoggerService) logger: WinstonLogger) {
        super()
        this.repositories = repositories;
        this.logger = logger;
    }

    public authUser(): AuthenticatedUser {
        return new AuthenticatedUser(this.httpContext.user);
    }

    public include(req: express.Request, item: string) {
        let result = false;
        if (req.query.include !== undefined) {
            const value: string = req.query.include as string;
            const items = value.split(',');
            if (items.indexOf(item) > -1) result = true;
        }
        return result;
    }

    public async actionWrapper(req: express.Request, res: express.Response, fetchFunction: (au: AuthenticatedUser) => any): Promise<any> {
        try {
            return await fetchFunction(this.authUser());
        } catch (e) {
            this.logger.logger.error(e);
            return this.internalServerError(e);
        }
    }



}
