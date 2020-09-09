import { injectable } from "inversify";
import { DB } from "../db";
import { Fund } from "../models";
import { stringify } from "uuid";

@injectable()
export class FundRepository {

    public async save(fund: Fund) {
        if (fund.id > 0) return this.update(fund); else return this.create(fund);
    }

    public async create(fund: Fund) {
        return DB.query(
            "INSERT INTO funds (churchId, name, removed) VALUES (?, ?, 0);",
            [fund.churchId, fund.name]
        ).then((row: any) => { fund.id = row.insertId; return fund; });
    }

    public async update(fund: Fund) {
        return DB.query(
            "UPDATE funds SET name=? WHERE id=? and churchId=?",
            [fund.name, fund.id, fund.churchId]
        ).then(() => { return fund });
    }

    public async delete(churchId: number, id: number) {
        DB.query("UPDATE funds SET removed=0 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM funds WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM funds WHERE churchId=? AND removed=0;", [churchId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Fund = { id: data.id, name: data.name };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Fund[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
