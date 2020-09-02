import { injectable } from "inversify";
import { DB } from "../db";
import { GroupMember } from "../models";

@injectable()
export class GroupMemberRepository {

    public async save(groupMember: GroupMember) {
        if (groupMember.id > 0) return this.update(groupMember); else return this.create(groupMember);
    }

    public async create(groupMember: GroupMember) {
        return DB.query(
            "INSERT INTO groupMembers (churchId, groupId, personId, joinDate) VALUES (churchId, groupId, personId, NOW());",
            [groupMember.churchId, groupMember.groupId, groupMember.personId]
        ).then((row: any) => { groupMember.id = row.insertId; return groupMember; });
    }

    public async update(groupMember: GroupMember) {
        return DB.query(
            "UPDATE groupMembers SET  groupId=?, personId=? WHERE id=? and churchId=?",
            [groupMember.groupId, groupMember.personId, groupMember.id, groupMember.churchId]
        ).then(() => { return groupMember });
    }

    public async delete(id: number, churchId: number) {
        DB.query("DELETE FROM groupMembers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(id: number, churchId: number) {
        return DB.queryOne("SELECT * FROM groupMembers WHERE id=? AND churchId=?;", [id, churchId]);
    }

}
