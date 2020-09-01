import { injectable } from "inversify";
import { DB } from "../db";
import { Campus } from "../models";

@injectable()
export class CampusRepository {
  public async load(id: number) {
    return DB.queryOne("SELECT * FROM campuses WHERE id=?;", [id]);
  }

  public async save(campus: Campus) {
    if (campus.id > 0) return this.update(campus); else return this.create(campus);
  }

  public async create(campus: Campus) {
    return DB.query("INSERT INTO campuses (name) VALUES (?);", [campus.name])
      .then((row: any) => { campus.id = row.insertId; return campus; });
  }

  public async update(campus: Campus) {
    return DB.query("UPDATE campuses SET name=? WHERE id=?", [campus.name, campus.id])
      .then(() => { return campus });
  }
}
