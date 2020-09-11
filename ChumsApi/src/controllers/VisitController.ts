import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Visit, VisitSession, Session } from "../models"

interface IdCache {
    [name: string]: number;
}

@controller("/visits")
export class VisitController extends CustomBaseController {


    static cachedSessionIds: IdCache = {};

    private async getSessionId(churchId: number, serviceTimeId: number, groupId: number, currentDate: Date) {
        let result = 0;
        const key = currentDate.toDateString() + "_" + serviceTimeId.toString() + "_" + groupId.toString();
        const cached: number = VisitController.cachedSessionIds[key];
        if (cached !== undefined) result = cached;
        else {
            let session: Session = await this.repositories.session.loadByGroupServiceTimeDate(churchId, groupId, serviceTimeId, currentDate);
            if (session === null) {
                session = { churchId, groupId, serviceTimeId, sessionDate: currentDate };
                session = await this.repositories.session.save(session);
            }
            VisitController.cachedSessionIds[key] = session.id;
            result = session.id;
        }
        return result;
    }

    @httpGet("/checkin")
    public async getCheckin(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {

            const result: Visit[] = []
            const serviceId = parseInt(req.query.serviceId.toString(), 0);
            const householdId = parseInt(req.query.householdId.toString(), 0);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const visits = this.repositories.visit.convertAllToModel(au.churchId, await this.repositories.visit.loadByHouseholdServiceDate(au.churchId, householdId, serviceId, currentDate));
            const visitIds: number[] = [];
            if (visits.length > 0) {
                visits.forEach(v => visitIds.push(v.id));
                const visitSessions = this.repositories.visitSession.convertAllToModel(au.churchId, await this.repositories.visitSession.loadByVisitIds(au.churchId, visitIds));
                if (visitSessions.length > 0) {
                    const sessionIds: number[] = [];
                    visitSessions.forEach(vs => sessionIds.push(vs.sessionId));
                    const sessions = this.repositories.session.convertAllToModel(au.churchId, await this.repositories.session.loadByIds(au.churchId, sessionIds));
                    visits.forEach(v => {
                        v.visitSessions = [];
                        visitSessions.forEach(vs => {
                            if (vs.visitId === v.id) {
                                sessions.forEach(s => { if (s.id === vs.sessionId) vs.session = s });
                                v.visitSessions.push(vs)
                            }
                        });
                        result.push(v);
                    })
                }

            }
            return result;
        });
    }

    @httpPost("/checkin")
    public async postCheckin(req: express.Request<{}, {}, Visit[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const deleteVisitIds: number[] = [];
            const deleteVisitSessionIds: number[] = [];

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const serviceId = parseInt(req.query.serviceId.toString(), 0);
            const householdId = parseInt(req.query.householdId.toString(), 0);
            const submittedVisits = [...req.body];
            submittedVisits.forEach(sv => {
                sv.churchId = au.churchId;
                sv.visitDate = currentDate;
                sv.checkinTime = new Date();
                sv.addedBy = au.id;
                sv.visitSessions.forEach(async vs => {
                    vs.sessionId = await this.getSessionId(au.churchId, vs.session.serviceTimeId, vs.session.groupId, currentDate)
                    vs.churchId = au.churchId;
                });
            });

            const existingVisitIds: number[] = [];
            const existingVisits = this.repositories.visit.convertAllToModel(au.churchId, await this.repositories.visit.loadByHouseholdServiceDate(au.churchId, householdId, serviceId, currentDate));
            if (existingVisits.length > 0) {
                existingVisits.forEach(v => existingVisitIds.push(v.id));
                const visitSessions = this.repositories.visitSession.convertAllToModel(au.churchId, await this.repositories.visitSession.loadByVisitIds(au.churchId, existingVisitIds));
                this.populateDeleteIds(existingVisits, submittedVisits, visitSessions, deleteVisitIds, deleteVisitSessionIds);
            }

            const promises: Promise<any>[] = [];
            this.getSavePromises(submittedVisits, promises);
            deleteVisitIds.forEach(visitId => { promises.push(this.repositories.visit.delete(au.churchId, visitId)); });
            deleteVisitSessionIds.forEach(visitSessionId => { promises.push(this.repositories.visitSession.delete(au.churchId, visitSessionId)); });

            await Promise.all(promises);

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


    private populateDeleteIds(existingVisits: Visit[], submittedVisits: Visit[], visitSessions: VisitSession[], deleteVisitIds: number[], deleteVisitSessionIds: number[]) {
        existingVisits.forEach(existingVisit => {
            existingVisit.visitSessions = [];
            visitSessions.forEach(vs => { if (vs.visitId === existingVisit.id) existingVisit.visitSessions.push(vs); });
            const matchedSubmittedVisits: Visit[] = [];
            submittedVisits.forEach(v => { if (v.personId === existingVisit.personId) matchedSubmittedVisits.push(v); });
            if (matchedSubmittedVisits.length === 0) {
                // Person has been removed.  Remove the visit and session.
                deleteVisitIds.push(existingVisit.id);
                existingVisit.visitSessions.forEach(vs => deleteVisitSessionIds.push(vs.id));
            } else {
                // Person is still checked in.  Make sure none of the sessions were removed.
                matchedSubmittedVisits[0].id = existingVisit.id;
                existingVisit.visitSessions.forEach(evs => {
                    const matchedSessions: VisitSession[] = [];
                    matchedSubmittedVisits[0].visitSessions.forEach(vs => { if (vs.sessionId === evs.sessionId) matchedSessions.push(vs); });
                    if (matchedSessions.length === 0) deleteVisitIds.push(evs.id);
                    else matchedSessions[0].id = evs.id;
                });
            }
        });
    }

    private async getSavePromises(submittedVisits: Visit[], promises: Promise<any>[]) {
        submittedVisits.forEach(submittedVisit => {
            promises.push(this.repositories.visit.save(submittedVisit).then(async sv => {
                const sessionPromises: Promise<VisitSession>[] = [];
                sv.visitSessions.forEach(vs => {
                    vs.visitId = sv.id;
                    sessionPromises.push(this.repositories.visitSession.save(vs));
                });
                await Promise.all(sessionPromises);
            }));
        });
    }

}
