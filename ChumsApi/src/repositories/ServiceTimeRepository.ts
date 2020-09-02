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

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE serviceTimes SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM serviceTimes WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
