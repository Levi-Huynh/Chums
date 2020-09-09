import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Form } from "../models"

@controller("/forms")
export class FormController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "View")) return this.json({}, 401);
            else return this.repositories.form.convertToModel(au.churchId, await this.repositories.form.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "View")) return this.json({}, 401);
            else return this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadAll(au.churchId));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Form[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Form>[] = [];
                req.body.forEach(form => { form.churchId = au.churchId; promises.push(this.repositories.form.save(form)); });
                const result = await Promise.all(promises);
                return this.repositories.form.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Forms", "Edit")) return this.json({}, 401);
            else await this.repositories.form.delete(au.churchId, id);
        });
    }

}
