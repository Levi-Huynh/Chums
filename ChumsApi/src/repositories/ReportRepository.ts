import { injectable } from "inversify";
import { DB } from "../db";
import { Report } from "../models";

@injectable()
export class ReportRepository {

    public async save(report: Report) {
        if (report.id > 0) return this.update(report); else return this.create(report);
    }

    public async create(report: Report) {
        const sql = "INSERT INTO reports (keyName, title, query, parameters, reportType, columns, groupBy) VALUES (?, ?, ? ?, ?, ?, ?);";
        const params = [report.keyName, report.title, report.query, report.parameters, report.reportType, report.columns, report.groupBy];
        return DB.query(sql, params).then((row: any) => { report.id = row.insertId; return report; });
    }

    public async update(report: Report) {
        const sql = "UPDATE reports SET keyName=?, title=?, query=?, parameters=?, reportType=?, columns=?, groupBy=? WHERE id=?";
        const params = [report.keyName, report.title, report.query, report.parameters, report.reportType, report.columns, report.groupBy, report.id]
        return DB.query(sql, params).then(() => { return report });
    }

    public async delete(id: number) {
        DB.query("DELETE FROM reports WHERE id=?;", [id]);
    }

    public async loadByKeyName(keyName: string) {
        return DB.queryOne("SELECT * FROM reports WHERE keyName=?;", [keyName]);
    }

    public async load(id: number) {
        return DB.queryOne("SELECT * FROM reports WHERE id=?;", [id]);
    }

    public async loadAll() {
        return DB.query("SELECT * FROM reports order by title;", []);
    }

    public convertToModel(data: any) {
        const result: Report = { id: data.id, keyName: data.keyName, title: data.title, query: data.query, parameters: data.parameters, groupBy: data.groupBy, reportType: data.reportType, columns: data.columns, results: data.results };
        return result;
    }

    public convertAllToModel(data: any[]) {
        const result: Report[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }

    public runReport(query: string, params: string[]) {
        return DB.query(query, params);
    }



}
