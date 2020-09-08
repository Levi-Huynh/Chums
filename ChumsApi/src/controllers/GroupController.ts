import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Group } from "../models"

@controller("/groups")
export class GroupController extends CustomBaseController {

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const campusId = parseInt(req.query.campusId.toString(), 0);
            const serviceId = parseInt(req.query.serviceId.toString(), 0);
            const serviceTimeId = parseInt(req.query.serviceTimeId.toString(), 0);
            return await this.repositories.group.search(au.churchId, campusId, serviceId, serviceTimeId);
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Groups", "View")) return this.json({}, 401);
            else return this.convertToModel(await this.repositories.group.load(id, au.churchId));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Groups", "View")) return this.json({}, 401);
            else return this.convertAllToModel(await this.repositories.group.loadAll(au.churchId));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Group[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Groups", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Group>[] = [];
                req.body.forEach(group => { group.churchId = au.churchId; promises.push(this.repositories.group.save(group)); });
                const result = await Promise.all(promises);
                return this.convertAllToModel(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Groups", "Edit")) return this.json({}, 401);
            else await this.repositories.group.delete(id, au.churchId);
        });
    }


    private convertToModel(data: any) {
        console.log(data);
        const result: Group = { id: data.id, categoryName: data.categoryName, name: data.name, trackAttendance: data.trackAttendance, memberCount: data.memberCount, importKey: data.importKey }
        return result;
    }

    private convertAllToModel(data: any[]) {
        const result: Group[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }

}
