import { injectable } from "inversify";
import { DB } from "../db";
import { VisitSession } from "../models";
import { PersonHelper } from "../helpers";

@injectable()
export class VisitSessionRepository {

    public async save(visitSession: VisitSession) {
        if (visitSession.id > 0) return this.update(visitSession); else return this.create(visitSession);
    }

    public async create(visitSession: VisitSession) {
        return DB.query(
            "INSERT INTO visitSessions (churchId, visitId, sessionId) VALUES (?, ?, ?);",
            [visitSession.churchId, visitSession.visitId, visitSession.sessionId]
        ).then((row: any) => { visitSession.id = row.insertId; return visitSession; });
    }

    public async update(visitSession: VisitSession) {
        return DB.query(
            "UPDATE visitSessions SET visitId=?, sessionId=? WHERE id=? and churchId=?",
            [visitSession.visitId, visitSession.sessionId, visitSession.id, visitSession.churchId]
        ).then(() => { return visitSession });
    }

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM visitSessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM visitSessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM visitSessions WHERE churchId=?;", [churchId]);
    }

    public async loadByVisitIdSessionId(churchId: number, visitId: number, sessionId: number) {
        return DB.queryOne("SELECT * FROM visitSessions WHERE churchId=? AND visitId=? AND sessionId=? LIMIT 1;", [churchId, visitId, sessionId]);
    }

    public async loadByVisitIds(churchId: number, visitIds: number[]) {
        return DB.query("SELECT * FROM visitSessions WHERE churchId=? AND visitId IN (" + visitIds.join(",") + ");", [churchId]);
    }

    public async loadByVisitId(churchId: number, visitId: number) {
        return DB.query("SELECT * FROM visitSessions WHERE churchId=? AND visitId=?;", [churchId, visitId]);
    }

    public async loadForSessionPerson(churchId: number, sessionId: number, personId: number) {
        const sql = "SELECT v.*"
            + " FROM sessions s"
            + " LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId"
            + " INNER JOIN visits v on(v.serviceId = st.serviceId or v.groupId = s.groupId) and v.visitDate = s.sessionDate"
            + " WHERE v.churchId=? AND s.id = ? AND v.personId=? LIMIT 1";
        return DB.queryOne(sql, [churchId, sessionId, personId]);
    }

    public async loadForSession(churchId: number, sessionId: number) {
        const sql = "SELECT vs.*, v.personId, p.photoUpdated, p.firstName, p.lastName, p.nickName, p.email, p.photoUpdated FROM"
            + " visitSessions vs"
            + " INNER JOIN visits v on v.id = vs.visitId"
            + " INNER JOIN people p on p.id = v.personId"
            + " WHERE vs.churchId=? AND vs.sessionId = ?";
        return DB.query(sql, [churchId, sessionId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: VisitSession = { id: data.id, visitId: data.visitId, sessionId: data.sessionId };
        if (data.personId !== undefined) {
            result.visit = { id: result.visitId, personId: data.personId }
            result.visit.person = { id: result.visit.personId, photoUpdated: data.photoUpdated, name: { first: data.firstName, last: data.lastName, nick: data.nickName }, contactInfo: { email: data.email } };
            result.visit.person.name.display = PersonHelper.getDisplayName(result.visit.person);
            result.visit.person.photo = PersonHelper.getPhotoUrl(churchId, result.visit.person);
        }
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: VisitSession[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
