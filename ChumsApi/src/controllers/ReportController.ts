import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Report, RunReportRequest } from "../models"
import { AuthenticatedUser } from "../auth";

@controller("/reports")
export class ReportController extends CustomBaseController {

    @httpPost("/run")
    public async run(req: express.Request<{}, {}, RunReportRequest[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const promises: Promise<Report>[] = [];
            req.body.forEach(report => { promises.push(this.runReport(report, au)); });
            const result = await Promise.all(promises);
            result.forEach(r => r.query = null); // not critical, these queries aren't secret. Just keeping things clean.
            return this.repositories.report.convertAllToModel(result);
        });
    }

    @httpGet("/admin")
    public async getAdmin(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Site", "Admin")) return this.json({}, 401);
            else return this.repositories.report.convertAllToModel(await this.repositories.report.loadAll());
        });
    }


    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Site", "Admin")) return this.json({}, 401);
            else return this.repositories.report.convertToModel(await this.repositories.report.load(id));
        });
    }


    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const result: Report[] = await this.repositories.report.loadAll();
            result.forEach(r => r.query = null); // not critical, these queries aren't secret. Just keeping things clean.
            return this.repositories.report.convertAllToModel(result);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Report[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Site", "Admin")) return this.json({}, 401);
            else {
                const promises: Promise<Report>[] = [];
                req.body.forEach(report => { promises.push(this.repositories.report.save(report)); });
                const result = await Promise.all(promises);
                result.forEach(r => r.query = null); // not critical, these queries aren't secret. Just keeping things clean.
                return this.repositories.report.convertAllToModel(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Site", "Admin")) return this.json({}, 401);
            else await this.repositories.report.delete(id);
        });
    }

    private async runReport(rrr: RunReportRequest, au: AuthenticatedUser) {
        const report: Report = (rrr.id !== undefined) ? await this.repositories.report.load(rrr.id) : await this.repositories.report.loadByKeyName(rrr.keyName);

        const params: any[] = report.parameters.split(',');
        for (let i = 0; i < params.length; i++) {
            if (params[i] === "churchId") params[i] = au.churchId;
        }

        report.results = await this.repositories.report.runReport(report.query, params);
        return report;
    }

}
