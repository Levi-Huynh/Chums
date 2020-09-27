import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Report } from "../models"

@controller("/reports")
export class ReportController extends CustomBaseController {

    @httpGet("/admin")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "View")) return this.json({}, 401);
            else return this.repositories.report.convertAllToModel(await this.repositories.report.loadAll());
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "View")) return this.json({}, 401);
            else return this.repositories.report.convertToModel(await this.repositories.report.load(id));
        });
    }



    @httpPost("/")
    public async save(req: express.Request<{}, {}, Report[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Report>[] = [];
                req.body.forEach(report => { promises.push(this.repositories.report.save(report)); });
                const result = await Promise.all(promises);
                return this.repositories.report.convertAllToModel(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "Edit")) return this.json({}, 401);
            else await this.repositories.report.delete(id);
        });
    }

}
