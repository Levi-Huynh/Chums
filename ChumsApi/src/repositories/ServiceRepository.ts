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
            "UPDATE services SET campusId=?, name=? WHERE id=? and churchId=?",
            [service.campusId, service.name, service.id, service.churchId]
        ).then(() => { return service });
    }

    public async delete(churchId: number, id: number) {
        DB.query("UPDATE services SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM services WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM services WHERE churchId=? AND removed=0;", [churchId]);
    }

    public async searchByCampus(churchId: number, campusId: number) {
        return DB.query("SELECT * FROM services WHERE churchId=? AND (?=0 OR CampusId=?) AND removed=0 ORDER by name;", [churchId, campusId, campusId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Service = { id: data.id, campusId: data.campusId, name: data.name };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Service[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
