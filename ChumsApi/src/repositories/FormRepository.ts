import { injectable } from "inversify";
import { DB } from "../db";
import { Form } from "../models";
import { stringify } from "uuid";

@injectable()
export class FormRepository {

    public async save(form: Form) {
        if (form.id > 0) return this.update(form); else return this.create(form);
    }

    public async create(form: Form) {
        return DB.query(
            "INSERT INTO forms (churchId, name, contentType, createdTime, modifiedTime, removed) VALUES (?, ?, ?, NOW(), NOW(), 0);",
            [form.churchId, form.name, form.contentType]
        ).then((row: any) => { form.id = row.insertId; return form; });
    }

    public async update(form: Form) {
        return DB.query(
            "UPDATE forms SET name=?, contentType=?, modifiedTime=NOW(), WHERE id=? and churchId=?",
            [form.name, form.contentType, form.id, form.churchId]
        ).then(() => { return form });
    }

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE forms SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM forms WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM forms WHERE churchId=?;", [churchId]);
    }

    public async loadByIds(churchId: number, ids: number[]) {
        const sql = "SELECT * FROM forms WHERE churchId=? AND removed=0 AND id IN (" + ids.join(",") + ") ORDER by name";
        return DB.query(sql, [churchId]);
    }


    public convertToModel(churchId: number, data: any) {
        const result: Form = { id: data.id, name: data.name, contentType: data.contentType, createdTime: data.createdTime, modifiedTime: data.modifiedTime };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Form[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
