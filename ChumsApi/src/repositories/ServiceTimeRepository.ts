import { injectable } from "inversify";
import { DB } from "../db";
import { ServiceTime } from "../models";

@injectable()
export class ServiceTimeRepository {

    public async save(serviceTime: ServiceTime) {
        if (serviceTime.id > 0) return this.update(serviceTime); else return this.create(serviceTime);
    }

    public async create(serviceTime: ServiceTime) {
        return DB.query(
            "INSERT INTO serviceTimes (churchId, serviceId, name, removed) VALUES (?, ?, ?, 0);",
            [serviceTime.churchId, serviceTime.serviceId, serviceTime.name]
        ).then((row: any) => { serviceTime.id = row.insertId; return serviceTime; });
    }

    public async update(serviceTime: ServiceTime) {
        return DB.query(
            "UPDATE serviceTimes SET serviceId=?, name=? WHERE id=? and churchId=?",
            [serviceTime.serviceId, serviceTime.name, serviceTime.id, serviceTime.churchId]
        ).then(() => { return serviceTime });
    }

    public async delete(churchId: number, id: number) {
        DB.query("UPDATE serviceTimes SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM serviceTimes WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM serviceTimes WHERE churchId=? AND removed=0;", [churchId]);
    }

    public async loadNamesWithCampusService(churchId: number) {
        return DB.query("SELECT st.*, concat(c.name, ' - ', s.name, ' - ', st.name) as longName FROM serviceTimes st INNER JOIN services s on s.Id=st.serviceId INNER JOIN campuses c on c.Id=s.campusId WHERE s.churchId=? AND st.removed=0 ORDER BY c.name, s.name, st.name;", [churchId]);
    }

    public async loadNamesByServiceId(churchId: number, serviceId: number) {
        return DB.query("SELECT st.*, concat(c.name, ' - ', s.name, ' - ', st.name) as longName FROM serviceTimes st INNER JOIN services s on s.id=st.serviceId INNER JOIN campuses c on c.id=s.campusId WHERE s.churchId=? AND s.id=? AND st.removed=0 ORDER BY c.name, s.name, st.name", [churchId, serviceId]);
    }

    public async loadByChurchCampusService(churchId: number, campusId: number, serviceId: number) {
        const sql = "SELECT st.*"
            + " FROM serviceTimes st"
            + " LEFT OUTER JOIN services s on s.id=st.serviceId"
            + " WHERE st.churchId = ? AND (?=0 OR st.serviceId=?) AND (? = 0 OR s.campusId = ?) AND st.removed=0";
        return DB.query(sql, [churchId, serviceId, serviceId, campusId, campusId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: ServiceTime = { id: data.id, serviceId: data.serviceId, name: data.name };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: ServiceTime[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
