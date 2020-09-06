import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { GroupServiceTime } from "../models"

@controller("/groupservicetimes")
export class GroupServiceTimeController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.convertAllToModel(await this.repositories.groupServiceTime.load(id, au.churchId));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            let result = null;
            if (req.query.groupId !== undefined) result = await this.repositories.groupServiceTime.loadWithServiceNames(au.churchId, parseInt(req.query.groupId.toString(), 0));
            else result = await this.repositories.groupServiceTime.loadAll(au.churchId);
            return this.convertAllToModel(result);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, GroupServiceTime[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<GroupServiceTime>[] = [];
                req.body.forEach(groupservicetime => { groupservicetime.churchId = au.churchId; promises.push(this.repositories.groupServiceTime.save(groupservicetime)); });
                const result = await Promise.all(promises);
                return this.convertAllToModel(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else await this.repositories.groupServiceTime.delete(id, au.churchId);
        });
    }

    private convertToModel(data: any) {
        console.log(data);
        const result: GroupServiceTime = { id: data.id, groupId: data.groupId, serviceTimeId: data.serviceTimeId }
        if (data.serviceTimeName !== undefined) result.serviceTime = { id: result.serviceTimeId, name: data.serviceTimeName }
        return result;
    }

    private convertAllToModel(data: any[]) {
        const result: GroupServiceTime[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }

}
