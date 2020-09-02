import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { FormSubmission } from "../models"

@controller("/formsubmissions")
export class FormSubmissionController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "View")) return this.json({}, 401);
            else return await this.repositories.formSubmission.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "View")) return this.json({}, 401);
            else return await this.repositories.formSubmission.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, FormSubmission[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<FormSubmission>[] = [];
                req.body.forEach(formsubmission => { formsubmission.churchId = au.churchId; promises.push(this.repositories.formSubmission.save(formsubmission)); });
                const result = await Promise.all(promises);
                return this.json(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "Edit")) return this.json({}, 401);
            else await this.repositories.formSubmission.delete(id, au.churchId);
        });
    }

}
