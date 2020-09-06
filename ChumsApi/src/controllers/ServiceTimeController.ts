import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { ServiceTime, GroupServiceTime, Group } from "../models"

@controller("/servicetimes")
export class ServiceTimeController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.serviceTime.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            // return await this.repositories.serviceTime.loadAll(au.churchId);
            let result = null;
            if (req.query.serviceId !== undefined) result = await this.repositories.serviceTime.loadNamesByServiceId(au.churchId, parseInt(req.query.serviceId.toString(), 0));
            else result = await this.repositories.serviceTime.loadNamesWithCampusService(au.churchId);
            result = this.convertAllToModel(result);
            if (result.length > 0 && this.include(req, "groups")) await this.appendGroups(au.churchId, result);
            return result;
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, ServiceTime[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<ServiceTime>[] = [];
                req.body.forEach(servicetime => { servicetime.churchId = au.churchId; promises.push(this.repositories.serviceTime.save(servicetime)); });
                const result = await Promise.all(promises);
                return result;
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else await this.repositories.serviceTime.delete(id, au.churchId);
        });
    }

    private async appendGroups(churchId: number, times: ServiceTime[]) {
        const timeIds: number[] = [];
        times.forEach(t => { timeIds.push(t.id) });
        const allGroupServiceTimes: GroupServiceTime[] = await this.repositories.groupServiceTime.loadByServiceTimeIds(churchId, timeIds);
        const allGroupIds: number[] = [];
        allGroupServiceTimes.forEach(gst => { if (allGroupIds.indexOf(gst.groupId) === -1) allGroupIds.push(gst.groupId); });
        const allGroups: Group[] = await this.repositories.group.loadByIds(churchId, allGroupIds);

        times.forEach(t => {
            const groups: Group[] = [];
            allGroupServiceTimes.forEach(gst => {
                if (gst.serviceTimeId === t.id) {
                    allGroups.forEach(g => { if (g.id === gst.groupId) groups.push(g); });
                }
            });
            t.groups = groups;
        });
    }




    private convertToModel(data: any) {
        const result: ServiceTime = { id: data.id, serviceId: data.serviceId, name: data.name, longName: data.longName };
        return result;
    }

    private convertAllToModel(data: any[]) {
        const result: ServiceTime[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }




}
