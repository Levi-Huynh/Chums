import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { ErrorLog } from "../models"
import { AuthenticatedUser } from "../auth";

@controller("/errors")
export class ErrorController extends CustomBaseController {

    @httpPost("/")
    public async save(req: express.Request<{}, {}, ErrorLog[]>, res: express.Response): Promise<any> {
        // try {
        const au: AuthenticatedUser = null;
        /*
        try {
            au = this.authUser();
        } catch (e) {
            this.logger.log(req.body[0].application, "info", e);
        }*/
        req.body.forEach(error => {
            let fullMessage = error.message;
            if (error.additionalDetails !== undefined) fullMessage += "\n" + error.additionalDetails;
            if (au !== null) fullMessage += "\nUser: " + au.id + " Church: " + au.churchId;
            this.logger.log(error.application, error.level, fullMessage);
        });
        await this.logger.flush();
        return req.body;
        // } catch (e) {
        // console.log(e)
        // };

    }

}
