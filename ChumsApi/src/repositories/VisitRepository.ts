import { injectable } from "inversify";
import { DB } from "../db";
import { Visit } from "../models";

@injectable()
export class VisitRepository {

    public async save(visit: Visit) {
        if (visit.id > 0) return this.update(visit); else return this.create(visit);
    }

    public async create(visit: Visit) {
        return DB.query(
            "INSERT INTO visits (churchId, personId, serviceId, groupId, visitDate, checkinTime, addedBy) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [visit.churchId, visit.personId, visit.serviceId, visit.groupId, visit.visitDate, visit.checkinTime, visit.addedBy]
        ).then((row: any) => { visit.id = row.insertId; return visit; });
    }

    public async update(visit: Visit) {
        return DB.query(
            "UPDATE visits SET personId=?, serviceId=?, groupId=?, visitDate=?, checkinTime=?, addedBy=? WHERE id=? and churchId=?",
            [visit.personId, visit.serviceId, visit.groupId, visit.visitDate, visit.checkinTime, visit.addedBy, visit.id, visit.churchId]
        ).then(() => { return visit });
    }

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM visits WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM visits WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM visits WHERE churchId=?;", [churchId]);
    }

    public async loadForSessionPerson(churchId: number, sessionId: number, personId: number) {
        const sql = "SELECT v.*"
            + " FROM sessions s"
            + " LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId"
            + " INNER JOIN visits v on(v.serviceId = st.serviceId or v.groupId = s.groupId) and v.visitDate = s.sessionDate"
            + " WHERE v.churchId=? AND s.id = ? AND v.personId=? LIMIT 1";
        return DB.queryOne(sql, [churchId, sessionId, personId]);
    }

    public async loadByHouseholdServiceDate(churchId: number, householdId: number, serviceId: number, visitDate: Date) {
        const sql = "SELECT * FROM visits WHERE churchId=? AND serviceId = ? AND visitDate = ? AND personId IN (SELECT id FROM people WHERE householdId = ?)";
        return DB.query(sql, [churchId, serviceId, visitDate, householdId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Visit = { id: data.id, personId: data.personId, serviceId: data.serviceId, groupId: data.groupId, visitDate: data.visitDate, checkinTime: data.checkinTime };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Visit[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
