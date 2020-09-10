import { injectable } from "inversify";
import { DB } from "../db";
import { Session } from "../models";

@injectable()
export class SessionRepository {

    public async save(session: Session) {
        if (session.id > 0) return this.update(session); else return this.create(session);
    }

    public async create(session: Session) {
        return DB.query(
            "INSERT INTO sessions (churchId, groupId, serviceTimeId, sessionDate) VALUES (?, ?, ?, ?);",
            [session.churchId, session.groupId, session.serviceTimeId, session.sessionDate]
        ).then((row: any) => { session.id = row.insertId; return session; });
    }

    public async update(session: Session) {
        return DB.query(
            "UPDATE sessions SET groupId=?, serviceTimeId=?, sessionDate=? WHERE id=? and churchId=?",
            [session.groupId, session.serviceTimeId, session.sessionDate, session.id, session.churchId]
        ).then(() => { return session });
    }

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM sessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM sessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadByIds(churchId: number, ids: number[]) {
        return DB.queryOne("SELECT * FROM sessions WHERE churchId=? AND id IN (" + ids.join(",") + ");", [churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM sessions WHERE churchId=?;", [churchId]);
    }

    public async loadByGroupIdWithNames(churchId: number, groupId: number) {
        const sql = "select s.id, "
            + " CASE"
            + "     WHEN st.name IS NULL THEN DATE_FORMAT(sessionDate, '%m/%d/%Y')"
            + "     ELSE concat(DATE_FORMAT(sessionDate, '%m/%d/%Y'), ' - ', st.name)"
            + " END AS displayName"
            + " FROM sessions s"
            + " LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId"
            + " WHERE s.churchId=? AND s.groupId=?"
            + " ORDER by s.sessionDate desc";
        return DB.query(sql, [churchId, groupId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Session = { id: data.id, groupId: data.groupId, serviceTimeId: data.serviceTimeId, sessionDate: data.sessionDate };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Session[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
