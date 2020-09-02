import { injectable } from "inversify";
import { DB } from "../db";
import { Answer } from "../models";

@injectable()
export class AnswerRepository {

    public async save(answer: Answer) {
        if (answer.id > 0) return this.update(answer); else return this.create(answer);
    }

    public async create(answer: Answer) {
        return DB.query(
            "INSERT INTO answers (churchId, formSubmissionId, questionId, value) VALUES (?, ?, ?, ?);",
            [answer.churchId, answer.formSubmissionId, answer.questionId, answer.value]
        ).then((row: any) => { answer.id = row.insertId; return answer; });
    }

    public async update(answer: Answer) {
        return DB.query(
            "UPDATE answers SET formSubmissionId=?, questionId=?, value=? WHERE id=? and churchId=?",
            [answer.formSubmissionId, answer.questionId, answer.value, answer.id, answer.churchId]
        ).then(() => { return answer });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM answers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM answers WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
