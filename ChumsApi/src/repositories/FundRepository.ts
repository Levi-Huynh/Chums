import { injectable } from "inversify";
import { DB } from "../db";
import { Fund } from "../models";

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

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE funds SET removed=0 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM funds WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM funds WHERE churchId=?;", [churchId]);
    }

}
