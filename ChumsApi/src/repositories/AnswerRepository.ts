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

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM answers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM answers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM answers WHERE churchId=?;", [churchId]);
    }

    public async loadForFormSubmission(churchId: number, formSubmissionId: number) {
        return DB.query("SELECT * FROM answers WHERE churchId=? AND formSubmissionId=?;", [churchId, formSubmissionId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Answer = { id: data.id, formSubmissionId: data.formSubmissionId, questionId: data.questionId, value: data.value };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Answer[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
