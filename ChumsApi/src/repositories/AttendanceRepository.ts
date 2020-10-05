import { injectable } from "inversify";
import { DB } from "../db";
import { AttendanceRecord } from "../models";

@injectable()
export class AttendanceRepository {

    public async loadGroups(churchId: number) {
        const sql = "SELECT * FROM ("
            + "     SELECT c.id as campusId, IFNULL(c.name, 'Unassigned') as campusName, s.id as serviceId, s.name as serviceName, st.id as serviceTimeId, st.name as serviceTimeName, g.id as groupId, g.categoryName, g.name as groupName"
            + "     FROM groups g"
            + "     LEFT JOIN groupServiceTimes gst on gst.groupId = g.id"
            + "     LEFT JOIN serviceTimes st on st.id = gst.serviceTimeId"
            + "     LEFT JOIN services s on s.id = st.serviceId"
            + "     LEFT JOIN campuses c on c.id = s.campusId"
            + "     WHERE(c.id is NULL or c.churchId = ?) AND(g.id IS NULL or(g.churchId = ? AND g.trackAttendance = 1)) AND IFNULL(g.removed, 0) = 0 AND IFNULL(st.removed, 0) = 0 AND IFNULL(s.removed, 0) = 0 AND IFNULL(c.removed, 0) = 0"
            + "     UNION"
            + "     SELECT c2.id as campusId, IFNULL(c2.name, 'Unassigned') as campusName, s2.id as serviceId, s2.name as serviceName, st2.id as serviceTimeId, st2.name as serviceTimeName, g2.Id as groupId, g2.categoryName, g2.name as groupName"
            + "     FROM groups g2"
            + "     RIGHT JOIN groupServiceTimes gst2 on gst2.groupId = g2.id"
            + "     RIGHT JOIN serviceTimes st2 on st2.id = gst2.serviceTimeId"
            + "     RIGHT JOIN services s2 on s2.id = st2.serviceId"
            + "     RIGHT JOIN campuses c2 on c2.id = s2.campusId"
            + "     WHERE(c2.id is NULL or c2.churchId = ?) AND(g2.id IS NULL or(g2.churchId = ? AND g2.trackAttendance = 1)) AND IFNULL(g2.removed, 0) = 0 AND IFNULL(st2.removed, 0) = 0 AND IFNULL(s2.removed, 0) = 0 AND IFNULL(c2.removed, 0) = 0"
            + " ) combined"
            + " ORDER by campusName, serviceName, serviceTimeName, categoryName, groupName";
        return DB.query(sql, [churchId, churchId, churchId, churchId]);
    }

    public async loadForPerson(churchId: number, personId: number) {
        const sql = "SELECT v.visitDate, c.id as campusId, c.name as campusName, ser.id as serviceId, ser.name as serviceName, st.id as serviceTimeId, st.name as serviceTimeName, g.id as groupId, g.categoryName, g.name as groupName"
            + " FROM visits v"
            + " INNER JOIN visitSessions vs on vs.visitId = v.id"
            + " INNER JOIN sessions s on s.id = vs.sessionId"
            + " INNER JOIN groups g on g.id = s.groupId"
            + " LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId"
            + " LEFT OUTER JOIN services ser on ser.Id = st.serviceId"
            + " LEFT OUTER JOIN campuses c on c.id = ser.campusId"
            + " WHERE v.churchId=? AND v.PersonId = ?"
            + " ORDER BY v.visitDate desc, c.name, ser.name, st.name";
        return DB.query(sql, [churchId, personId]);
    }

    public async load(churchId: number, campusId: number, serviceId: number, serviceTimeId: number, categoryName: string, groupId: number, startDate: Date, endDate: Date, groupBy: string, trend: boolean) {
        const field = this.getGroupByField(groupBy);
        const params = [];
        params.push(churchId);
        params.push(startDate);
        params.push(endDate);

        let sql = "SELECT ";
        if (trend) sql += "week(v.visitDate,0) as week, ";
        sql += field + " as " + groupBy + ", Count(distinct(p.id)) as count"
            + " FROM visitSessions vs"
            + " INNER JOIN visits v on v.id = vs.visitId"
            + " INNER JOIN sessions s on s.id = vs.sessionId"
            + " INNER JOIN people p on p.id = v.personId"
            + " INNER JOIN groups g on g.id = s.groupId"
            + " LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId"
            + " LEFT OUTER JOIN services ser on ser.id = st.serviceId"
            + " LEFT OUTER JOIN campuses c on c.id = ser.campusId"
            + " WHERE p.churchId = ? AND v.visitDate BETWEEN ? AND ?";

        if (campusId > 0) { sql += " AND ser.campusId=?"; params.push(campusId); }
        if (serviceId > 0) { sql += " AND ser.id=?"; params.push(serviceId); }
        if (serviceTimeId > 0) { sql += " AND st.id=?"; params.push(serviceTimeId); }
        if (categoryName !== "") { sql += " AND g.categoryName=?"; params.push(categoryName); }
        if (groupId > 0) { sql += " AND g.id=?"; params.push(groupId); }
        sql += " GROUP BY ";
        if (trend) sql += "week(v.visitDate, 0), ";
        sql += field + " ORDER BY ";
        if (trend) sql += "week(v.visitDate, 0), ";
        sql += field;
        return DB.query(sql, params);
    }

    public getGroupByField(groupBy: string) {
        let result = "c.name";
        switch (groupBy) {
            case "groupName": result = "g.name"; break;
            case "campusName": result = "c.name"; break;
            case "serviceName": result = "ser.name"; break;
            case "serviceTimeName": result = "st.name"; break;
            case "categoryName": result = "g.categoryName"; break;
            case "gender": result = "p.gender"; break;
        }
        return result;
    }

    public convertToModel(churchId: number, data: any) {
        const result: AttendanceRecord = { visitDate: data.visitDate, week: data.week, count: data.count, gender: data.gender };
        if (data.groupId !== undefined || data.groupName !== undefined || data.categoryName !== undefined) result.group = { id: data.groupId, categoryName: data.categoryName, name: data.groupName };
        if (data.campusId !== undefined || data.campusName !== undefined) result.campus = { id: data.campusId, name: data.campusName };
        if (data.serviceId !== undefined || data.serviceName !== undefined) result.service = { id: data.serviceId, name: data.serviceName, campusId: data.campusId };
        if (data.serviceTimeId !== undefined || data.serviceTimeName !== undefined) result.serviceTime = { id: data.serviceTimeId, name: data.serviceTimeName, serviceId: data.serviceId };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: AttendanceRecord[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
