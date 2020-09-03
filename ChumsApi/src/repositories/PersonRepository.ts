import { injectable } from "inversify";
import { DB } from "../db";
import { Person } from "../models";

@injectable()
export class PersonRepository {

    public async save(person: Person) {
        if (person.id > 0) return this.update(person); else return this.create(person);
    }

    public async create(person: Person) {
        return DB.query(
            "INSERT INTO people (churchId, userId, firstName, middleName, lastName, nickName, prefix, suffix, birthDate, gender, maritalStatus, anniversary, membershipStatus, homePhone, mobilePhone, workPhone, email, address1, address2, city, state, zip, photoUpdated, householdId, householdRole, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);",
            [
                person.churchId, person.userId,
                person.name.first, person.name.middle, person.name.last, person.name.nick, person.name.prefix, person.name.suffix,
                person.birthDate, person.gender, person.maritalStatus, person.anniversary, person.membershipStatus,
                person.contactInfo.homePhone, person.contactInfo.mobilePhone, person.contactInfo.workPhone, person.contactInfo.email, person.contactInfo.address1, person.contactInfo.address2, person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip,
                person.photoUpdated, person.householdId, person.householdRole
            ]
        ).then((row: any) => { person.id = row.insertId; return person; });
    }

    public async update(person: Person) {
        return DB.query(
            "UPDATE people SET userId=?, firstName=?, middleName=?, lastName=?, nickName=?, prefix=?, suffix=?, birthDate=?, gender=?, maritalStatus=?, anniversary=?, membershipStatus=?, homePhone=?, mobilePhone=?, workPhone=?, email=?, address1=?, address2=?, city=?, state=?, zip=?, photoUpdated=?, householdId=?, householdRole=? WHERE id=? and churchId=?",
            [
                person.userId,
                person.name.first, person.name.middle, person.name.last, person.name.nick, person.name.prefix, person.name.suffix,
                person.birthDate, person.gender, person.maritalStatus, person.anniversary, person.membershipStatus,
                person.contactInfo.homePhone, person.contactInfo.mobilePhone, person.contactInfo.workPhone, person.contactInfo.email, person.contactInfo.address1, person.contactInfo.address2, person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip,
                person.photoUpdated, person.householdId, person.householdRole
            ]
        ).then(() => { return person });
    }

    public async delete(id: number, churchId: number) {
        DB.query("UPDATE people SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM people WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadByUserId(userId: number, churchId: number) {
        return DB.queryOne("SELECT * FROM people WHERE userId=? AND churchId=?;", [userId, churchId]);
    }

    // Need to cast
    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM people WHERE churchId=?;", [churchId]);
    }

    public async search(churchId: number, term: string) {
        return DB.query(
            "SELECT * FROM people WHERE churchId=? AND concat(IFNULL(FirstName,''), ' ', IFNULL(MiddleName,''), ' ', IFNULL(NickName,''), ' ', IFNULL(LastName,'')) LIKE ? LIMIT 100;",
            [churchId, "%" + term.replace(" ", "%") + "%"]
        );
    }

    public async searchPhone(churchId: number, phoneNumber: string) {
        return DB.query(
            "SELECT * FROM people WHERE churchId=? AND (REPLACE(HomePhone,'-','') LIKE @PhoneNumber OR REPLACE(WorkPhone,'-','') LIKE @PhoneNumber OR REPLACE(MobilePhone,'-','') LIKE @PhoneNumber) LIMIT 100;",
            [churchId, "%" + phoneNumber.replace(" ", "%") + "%"]
        );
    }

}
