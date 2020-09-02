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

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM sessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM sessions WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
