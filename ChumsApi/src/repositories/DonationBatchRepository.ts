import { injectable } from "inversify";
import { DB } from "../db";
import { DonationBatch } from "../models";

@injectable()
export class DonationBatchRepository {

    public async save(donationBatch: DonationBatch) {
        if (donationBatch.id > 0) return this.update(donationBatch); else return this.create(donationBatch);
    }

    public async create(donationBatch: DonationBatch) {
        return DB.query(
            "INSERT INTO donationBatches (churchId, name, batchDate) VALUES (?, ?, ?);",
            [donationBatch.churchId, donationBatch.name, donationBatch.batchDate]
        ).then((row: any) => { donationBatch.id = row.insertId; return donationBatch; });
    }

    public async update(donationBatch: DonationBatch) {
        return DB.query(
            "UPDATE donationBatches SET name=?, batchDate=? WHERE id=? and churchId=?",
            [donationBatch.name, donationBatch.batchDate, donationBatch.id, donationBatch.churchId]
        ).then(() => { return donationBatch });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM donationBatches WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM donationBatches WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
