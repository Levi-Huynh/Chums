import { injectable } from "inversify";
import { DB } from "../db";
import { Donation } from "../models";

@injectable()
export class DonationRepository {

    public async save(donation: Donation) {
        if (donation.id > 0) return this.update(donation); else return this.create(donation);
    }

    public async create(donation: Donation) {
        return DB.query(
            "INSERT INTO donations (churchId, batchId, personId, donationDate, amount, method, methodDetails, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [donation.churchId, donation.batchId, donation.personId, donation.donationDate, donation.amount, donation.method, donation.methodDetails, donation.notes]
        ).then((row: any) => { donation.id = row.insertId; return donation; });
    }

    public async update(donation: Donation) {
        return DB.query(
            "UPDATE donations SET batchId=?, personId=?, donationDate=?, amount=?, method=?, methodDetails=?, notes=?, WHERE id=? and churchId=?",
            [donation.batchId, donation.personId, donation.donationDate, donation.amount, donation.method, donation.methodDetails, donation.notes, donation.id, donation.churchId]
        ).then(() => { return donation });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM donations WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM donations WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM donations WHERE churchId=?;", [churchId]);
    }

}
