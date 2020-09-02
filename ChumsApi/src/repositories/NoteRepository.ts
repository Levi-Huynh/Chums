import { injectable } from "inversify";
import { DB } from "../db";
import { Note } from "../models";

@injectable()
export class NoteRepository {

    public async save(note: Note) {
        if (note.id > 0) return this.update(note); else return this.create(note);
    }

    public async create(note: Note) {
        return DB.query(
            "INSERT INTO notes (churchId, contentType, contentId, noteType, addedBy, dateAdded, contents) VALUES (?, ?, ?, ?, ?, NOW(), ?);",
            [note.churchId, note.contentType, note.contentId, note.contentType, note.addedBy, note.contents]
        ).then((row: any) => { note.id = row.insertId; return note; });
    }

    public async update(note: Note) {
        return DB.query(
            "UPDATE notes SET contentType=?, contentId=?, noteType=?, contents=? WHERE id=? and churchId=?",
            [note.contentType, note.contentId, note.contentType, note.contents, note.id, note.churchId]
        ).then(() => { return note });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM notes WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM notes WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM notes WHERE churchId=?;", [churchId]);
    }

}
