import { injectable } from "inversify";
import { DB } from "../db";
import { Form } from "../models";

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

}
