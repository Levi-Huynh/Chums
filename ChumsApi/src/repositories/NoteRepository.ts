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

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM notes WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM notes WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadForContent(churchId: number, contentType: string, contentId: number) {
        return DB.query("SELECT n.*, p.photoUpdated, p.firstName, p.lastName, p.nickName FROM notes n INNER JOIN people p on p.churchId=n.churchId AND p.userId=n.addedBy WHERE n.churchId=? AND n.contentType=? AND n.contentId=?;", [churchId, contentType, contentId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM notes WHERE churchId=?;", [churchId]);
    }


}
