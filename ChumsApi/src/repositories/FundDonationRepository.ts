import { injectable } from "inversify";
import { DB } from "../db";
import { FundDonation, Donation } from "../models";
import { PersonHelper } from "../helpers";

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
            "UPDATE fundDonations SET donationId=?, fundId=?, amount=? WHERE id=? and churchId=?",
            [fundDonation.donationId, fundDonation.fundId, fundDonation.amount, fundDonation.id, fundDonation.churchId]
        ).then(() => { return fundDonation });
    }

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM fundDonations WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM fundDonations WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM fundDonations WHERE churchId=?;", [churchId]);
    }

    public async loadByDonationId(churchId: number, donationId: number) {
        return DB.query("SELECT * FROM fundDonations WHERE churchId=? AND donationId=?;", [churchId, donationId]);
    }

    public async loadByFundId(churchId: number, fundId: number) {
        return DB.query("SELECT fd.*, d.donationDate, d.batchId, d.personId, p.displayName FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId LEFT JOIN people p on p.Id=d.personId WHERE fd.churchId=? AND fd.fundId=? ORDER by d.donationDate desc;", [churchId, fundId]);
    }

    public async loadByFundIdDate(churchId: number, fundId: number, startDate: Date, endDate: Date) {
        return DB.query("SELECT fd.*, d.donationDate, d.batchId, d.personId, p.displayName FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId LEFT JOIN people p on p.Id=d.personId WHERE fd.churchId=? AND fd.fundId=? AND d.donationDate BETWEEN ? AND ? ORDER by d.donationDate desc;", [churchId, fundId, startDate, endDate]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: FundDonation = { id: data.id, donationId: data.donationId, fundId: data.fundId, amount: data.amount };
        if (data.batchId !== undefined) {
            result.donation = { id: result.donationId, donationDate: data.donationDate, batchId: data.batchId, personId: data.personId };
            if (data.displayName !== undefined) {
                result.donation.person = { id: result.donation.personId, name: { display: data.displayName } };
            }
        }
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: FundDonation[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
