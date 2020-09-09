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

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM donationBatches WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM donationBatches WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        const sql = "SELECT *"
            + " , IFNULL((SELECT Count(*) FROM donations WHERE batchId = db.Id),0) AS donationCount"
            + " , IFNULL((SELECT SUM(amount) FROM donations WHERE batchId = db.Id),0) AS totalAmount"
            + " FROM donationBatches db"
            + " WHERE db.churchId = ?";
        return DB.query(sql, [churchId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: DonationBatch = { id: data.id, name: data.name, batchDate: data.batchDate, donationCount: data.donationCount, totalAmount: data.totalAmount };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        console.log(data);
        const result: DonationBatch[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
