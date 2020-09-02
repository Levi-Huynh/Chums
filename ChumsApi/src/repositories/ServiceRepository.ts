import { injectable } from "inversify";
import { DB } from "../db";
import { Service } from "../models";

@injectable()
export class ServiceRepository {

    public async save(service: Service) {
        if (service.id > 0) return this.update(service); else return this.create(service);
    }

    public async create(service: Service) {
        return DB.query(
            "INSERT INTO services (churchId, campusId, name, removed) VALUES (?, ?, ?, 0);",
            [service.churchId, service.campusId, service.name]
        ).then((row: any) => { service.id = row.insertId; return service; });
    }

    public async update(service: Service) {
        return DB.query(
            "UPDATE services SET campusId=?, name=?, WHERE id=? and churchId=?",
            [service.campusId, service.name, service.id, service.churchId]
        ).then(() => { return service });
    }

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE services SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM services WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
