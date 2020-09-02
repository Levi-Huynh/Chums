import { injectable } from "inversify";
import { DB } from "../db";
import { FundDonation } from "../models";

@injectable()
export class FundDonationRepository {

    public async save(fundDonation: FundDonation) {
        if (fundDonation.id > 0) return this.update(fundDonation); else return this.create(fundDonation);
    }

    public async create(fundDonation: FundDonation) {
        return DB.query(
            "INSERT INTO fundDonations (churchId, donationId, fundId, amount) VALUES (?, ?, ?, ?);",
            [fundDonation.churchId, fundDonation.donationId, fundDonation.fundId, fundDonation.amount]
        ).then((row: any) => { fundDonation.id = row.insertId; return fundDonation; });
    }

    public async update(fundDonation: FundDonation) {
        return DB.query(
            "UPDATE fundDonations SET donationId=?, fundId=?, amount=?, notes=? WHERE id=? and churchId=?",
            [fundDonation.donationId, fundDonation.fundId, fundDonation.amount, fundDonation.id, fundDonation.churchId]
        ).then(() => { return fundDonation });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM fundDonations WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM fundDonations WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
