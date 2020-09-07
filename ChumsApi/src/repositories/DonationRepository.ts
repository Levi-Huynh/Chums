import { injectable } from "inversify";
import { DB } from "../db";
import { Donation } from "../models";
import { PersonHelper } from "../helpers"

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
            "UPDATE donations SET batchId=?, personId=?, donationDate=?, amount=?, method=?, methodDetails=?, notes=? WHERE id=? and churchId=?",
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

    public async loadByBatchId(churchId: number, batchId: number) {
        return DB.query("SELECT d.*, p.firstName, p.lastName, p.nickName FROM donations d LEFT OUTER JOIN people p on p.Id=d.personId WHERE d.churchId=? AND d.batchId=?;", [churchId, batchId]);
    }

    public async loadByPersonId(churchId: number, personId: number) {
        const sql = "SELECT d.*, f.id as fundId, f.name as fundName"
            + " FROM donations d"
            + " INNER JOIN fundDonations fd on fd.donationId = d.id"
            + " INNER JOIN funds f on f.id = fd.fundId"
            + " WHERE d.churchId = ? AND d.personId = ?";
        return DB.query(sql, [churchId, personId]);
    }


    public convertToModel(churchId: number, data: any) {
        const result: Donation = { id: data.id, batchId: data.batchId, personId: data.personId, donationDate: data.donationDate, amount: data.amount, method: data.method, methodDetails: data.methodDetails, notes: data.notes };
        if (data.lastName !== undefined) {
            result.person = { id: result.personId, name: { first: data.firstName, last: data.lastName, nick: data.nickName } };
            result.person.name.display = PersonHelper.getDisplayName(result.person);
        }
        if (data.fundName !== undefined) result.fund = { id: data.fundId, name: data.fundName };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        console.log(data);
        const result: Donation[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
