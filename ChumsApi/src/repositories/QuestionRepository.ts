import { injectable } from "inversify";
import { DB } from "../db";
import { Question } from "../models";

@injectable()
export class QuestionRepository {

    public async save(question: Question) {
        if (question.id > 0) return this.update(question); else return this.create(question);
    }

    public async create(question: Question) {
        return DB.query(
            "INSERT INTO questions (churchId, formId, parentId, title, description, fieldType, placeholder, sort, choices, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);",
            [question.churchId, question.formId, question.parentId, question.title, question.description, question.fieldType, question.placeholder, question.sort, question.choices]
        ).then((row: any) => { question.id = row.insertId; return question; });
    }

    public async update(question: Question) {
        return DB.query(
            "UPDATE questions SET formId=?, parentId=?, title=?, description=?, fieldType=?, placeholder=?, sort=?, choices=?, WHERE id=? and churchId=?",
            [question.formId, question.parentId, question.title, question.description, question.fieldType, question.placeholder, question.sort, question.choices, question.id, question.churchId]
        ).then(() => { return question });
    }

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE questions SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM questions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM questions WHERE churchId=?;", [churchId]);
    }

}
