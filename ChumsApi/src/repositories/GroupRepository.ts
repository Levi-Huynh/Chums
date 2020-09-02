import { injectable } from "inversify";
import { DB } from "../db";
import { Group } from "../models";

@injectable()
export class GroupRepository {

    public async save(group: Group) {
        if (group.id > 0) return this.update(group); else return this.create(group);
    }

    public async create(group: Group) {
        return DB.query(
            "INSERT INTO groups (churchId, categoryName, name, trackAttendance, removed) VALUES (?, ?, ?, ?, 0);",
            [group.churchId, group.categoryName, group.name, group.trackAttendance]
        ).then((row: any) => { group.id = row.insertId; return group; });
    }

    public async update(group: Group) {
        return DB.query(
            "UPDATE groups SET churchId=?, categoryName=?, name=?, trackAttendance=? WHERE id=? and churchId=?",
            [group.churchId, group.categoryName, group.name, group.trackAttendance, group.id, group.churchId]
        ).then(() => { return group });
    }

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE groups SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM groups WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM groups WHERE churchId=?;", [churchId]);
    }

}
