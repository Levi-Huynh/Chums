import { injectable } from "inversify";
import { DB } from "../db";
import { Campus } from "../models";

@injectable()
export class CampusRepository {

  public async save(campus: Campus) {
    if (campus.id > 0) return this.update(campus); else return this.create(campus);
  }

  public async create(campus: Campus) {
    return DB.query(
      "INSERT INTO campuses (churchId, name, address1, address2, city, state, zip, removed) VALUES (?, ?, ?, ?, ?, ?, ?, 0);",
      [campus.churchId, campus.name, campus.address1, campus.address2, campus.city, campus.state, campus.zip]
    ).then((row: any) => { campus.id = row.insertId; return campus; });
  }

  public async update(campus: Campus) {
    return DB.query(
      "UPDATE campuses SET name=?, address1=?, address2=?, city=?, state=?, zip=? WHERE id=? and churchId=?",
      [campus.name, campus.address1, campus.address2, campus.city, campus.state, campus.zip, campus.id, campus.churchId]
    ).then(() => { return campus });
  }

  public async delete(churchId: number, id: number) {
    DB.query("UPDATE campuses SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public async load(churchId: number, id: number) {
    return DB.queryOne("SELECT * FROM campuses WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
  }

  public async loadAll(churchId: number) {
    return DB.query("SELECT * FROM campuses WHERE churchId=? AND removed=0;", [churchId]);
  }

  public convertToModel(churchId: number, data: any) {
    const result: Campus = { id: data.id, name: data.name, address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, importKey: data.importKey };
    return result;
  }

  public convertAllToModel(churchId: number, data: any[]) {
    const result: Campus[] = [];
    data.forEach(d => result.push(this.convertToModel(churchId, d)));
    return result;
  }

}
