import { injectable } from "inversify";
import { DB } from "../db";
import { FormSubmission } from "../models";

@injectable()
export class FormSubmissionRepository {

    public async save(formSubmission: FormSubmission) {
        if (formSubmission.id > 0) return this.update(formSubmission); else return this.create(formSubmission);
    }

    public async create(formSubmission: FormSubmission) {
        return DB.query(
            "INSERT INTO formsubmissions (churchId, formId, contentType, contentId, submissionDate, submittedBy, revisionDate, revisedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [formSubmission.churchId, formSubmission.formId, formSubmission.contentType, formSubmission.contentId, formSubmission.submissionDate, formSubmission.submittedBy, formSubmission.revisionDate, formSubmission.revisedBy]
        ).then((row: any) => { formSubmission.id = row.insertId; return formSubmission; });
    }

    public async update(formSubmission: FormSubmission) {
        return DB.query(
            "UPDATE formsubmissions SET revisionDate=NOW(), revisedBy=? WHERE id=? and churchId=?",
            [formSubmission.revisedBy, formSubmission.id, formSubmission.churchId]
        ).then(() => { return formSubmission });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM formSubmissions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM formSubmissions WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
