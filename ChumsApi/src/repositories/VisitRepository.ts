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
            "UPDATE visits SET personId=?, serviceId=?, groupId=?, visitDate=?, checkinTime=?, addedBy=?, WHERE id=? and churchId=?",
            [visit.personId, visit.serviceId, visit.groupId, visit.visitDate, visit.checkinTime, visit.addedBy, visit.id, visit.churchId]
        ).then(() => { return visit });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM visits WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM visits WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
