import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { ServiceTime, GroupServiceTime, Group } from "../models"

@controller("/servicetimes")
export class ServiceTimeController extends CustomBaseController {

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const campusId = parseInt(req.query.campusId.toString(), 0);
            const serviceId = parseInt(req.query.serviceId.toString(), 0);
            return this.repositories.serviceTime.convertAllToModel(au.churchId, await this.repositories.serviceTime.loadByChurchCampusService(au.churchId, campusId, serviceId));
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.repositories.serviceTime.convertToModel(au.churchId, await this.repositories.serviceTime.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            // return await this.repositories.serviceTime.loadAll(au.churchId);
            let result = null;
            if (req.query.serviceId !== undefined) result = await this.repositories.serviceTime.loadNamesByServiceId(au.churchId, parseInt(req.query.serviceId.toString(), 0));
            else result = await this.repositories.serviceTime.loadNamesWithCampusService(au.churchId);
            console.log(result);
            result = this.repositories.serviceTime.convertAllToModel(au.churchId, result);
            console.log(result);
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
                return this.repositories.serviceTime.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
            else await this.repositories.serviceTime.delete(au.churchId, id);
        });
    }

    private async appendGroups(churchId: number, times: ServiceTime[]) {
        const timeIds: number[] = [];
        times.forEach(t => { timeIds.push(t.id) });
        const allGroupServiceTimes: GroupServiceTime[] = await this.repositories.groupServiceTime.loadByServiceTimeIds(churchId, timeIds);
        const allGroupIds: number[] = [];
        allGroupServiceTimes.forEach(gst => { if (allGroupIds.indexOf(gst.groupId) === -1) allGroupIds.push(gst.groupId); });
        const allGroups: any[] = await this.repositories.group.loadByIds(churchId, allGroupIds);
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







}
