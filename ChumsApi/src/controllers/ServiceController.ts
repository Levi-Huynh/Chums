import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Service } from "../models"

@controller("/services")
export class ServiceController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.service.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.service.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Service[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Service>[] = [];
                req.body.forEach(service => { service.churchId = au.churchId; promises.push(this.repositories.service.save(service)); });
                const result = await Promise.all(promises);
                return result;
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else await this.repositories.service.delete(id, au.churchId);
        });
    }

}
