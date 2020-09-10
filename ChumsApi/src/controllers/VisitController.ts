import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Visit } from "../models"

@controller("/visits")
export class VisitController extends CustomBaseController {

    @httpGet("/checkin")
    public async getCheckin(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {

            const result: Visit[] = []
            const serviceId = parseInt(req.query.serviceId.toString(), 0);
            const householdId = parseInt(req.query.householdId.toString(), 0);

            const visits = this.repositories.visit.convertAllToModel(au.churchId, await this.repositories.visit.loadByHouseholdServiceDate(au.churchId, householdId, serviceId, new Date()));
            const visitIds: number[] = [];
            if (visits.length > 0) {
                visits.forEach(v => visitIds.push(v.id));
                const visitSessions = this.repositories.visitSession.convertAllToModel(au.churchId, await this.repositories.visitSession.loadByVisitIds(au.churchId, visitIds));
                if (visitSessions.length > 0) {
                    const visitSessionIds: number[] = [];
                    visitSessions.forEach(vs => visitSessionIds.push(vs.id));
                    const sessions = this.repositories.session.convertAllToModel(au.churchId, await this.repositories.session.loadByIds(au.churchId, visitSessionIds));
                    visits.forEach(v => {
                        v.visitSessions = [];
                        visitSessions.forEach(vs => {
                            if (vs.visitId === v.id) {
                                sessions.forEach(s => { if (s.id === vs.sessionId) vs.session = s });
                                v.visitSessions.push(vs)
                            }
                        });
                    })
                }

            }
            return result;
        });
    }


    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Attendance", "View")) return this.json({}, 401);
            else return this.repositories.visit.convertToModel(au.churchId, await this.repositories.visit.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Attendance", "View")) return this.json({}, 401);
            else return this.repositories.visit.convertAllToModel(au.churchId, await this.repositories.visit.loadAll(au.churchId));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Visit[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Attendance", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Visit>[] = [];
                req.body.forEach(visit => { visit.churchId = au.churchId; promises.push(this.repositories.visit.save(visit)); });
                const result = await Promise.all(promises);
                return this.repositories.visit.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.visit.delete(au.churchId, id);
        });
    }

}
