import { injectable } from "inversify";
import { DB } from "../db";
import { VisitSession } from "../models";

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
            "UPDATE visitSessions SET visitId=?, sessionId=?, WHERE id=? and churchId=?",
            [visitSession.visitId, visitSession.sessionId, visitSession.id, visitSession.churchId]
        ).then(() => { return visitSession });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM visitSessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM visitSessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
