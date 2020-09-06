import { injectable } from "inversify";
import { DB } from "../db";
import { GroupServiceTime } from "../models";

@injectable()
export class GroupServiceTimeRepository {

    public async save(groupServiceTime: GroupServiceTime) {
        if (groupServiceTime.id > 0) return this.update(groupServiceTime); else return this.create(groupServiceTime);
    }

    public async create(groupServiceTime: GroupServiceTime) {
        return DB.query(
            "INSERT INTO groupServiceTimes (churchId, groupId, serviceTimeId) VALUES (?, ?, ?);",
            [groupServiceTime.churchId, groupServiceTime.groupId, groupServiceTime.serviceTimeId]
        ).then((row: any) => { groupServiceTime.id = row.insertId; return groupServiceTime; });
    }

    public async update(groupServiceTime: GroupServiceTime) {
        return DB.query(
            "UPDATE groupServiceTimes SET groupId=?, serviceTimeId=? WHERE id=? and churchId=?",
            [groupServiceTime.groupId, groupServiceTime.serviceTimeId, groupServiceTime.id, groupServiceTime.churchId]
        ).then(() => { return groupServiceTime });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM groupServiceTimes WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM groupServiceTimes WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM groupServiceTimes WHERE churchId=?;", [churchId]);
    }

    public async loadWithServiceNames(churchId: number, groupId: number) {
        const sql = "SELECT gst.*, concat(c.name, ' - ', s.name, ' - ', st.name) as serviceTimeName"
            + " FROM groupServiceTimes gst"
            + " INNER JOIN serviceTimes st on st.id = gst.serviceTimeId"
            + " INNER JOIN services s on s.id = st.serviceId"
            + " INNER JOIN campuses c on c.id = s.campusId"
            + " WHERE gst.churchId=? AND gst.groupId=?";
        return DB.query(sql, [churchId, groupId]);
    }

    public async loadByServiceTimeIds(churchId: number, serviceTimeIds: number[]) {
        const sql = "SELECT * FROM groupServiceTimes WHERE churchId=? AND serviceTimeId IN (" + serviceTimeIds.join(",") + ")";
        return DB.query(sql, [churchId]);
    }

}
