import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"

@controller("/attendancerecords")
export class AttendanceRecordController extends CustomBaseController {
    @httpGet("/groups")
    public async groups(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.attendance.loadGroups(au.churchId);
            return this.repositories.attendance.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/")
    public async load(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const personId = (req.query.personId === undefined) ? 0 : parseInt(req.query.personId.toString(), 0);
            let result;

            if (personId > 0) {
                if (!au.checkAccess("Attendance", "View")) return this.json({}, 401);
                else result = await this.repositories.attendance.loadForPerson(au.churchId, personId);
            } else {
                if (!au.checkAccess("Attendance", "View Summary")) return this.json({}, 401);
                else {
                    const campusId = (req.query.campusId === undefined) ? 0 : parseInt(req.query.campusId.toString(), 0);
                    const serviceId = (req.query.serviceId === undefined) ? 0 : parseInt(req.query.serviceId.toString(), 0);
                    const serviceTimeId = (req.query.serviceTimeId === undefined) ? 0 : parseInt(req.query.serviceTimeId.toString(), 0);
                    const groupId = (req.query.groupId === undefined) ? 0 : parseInt(req.query.groupId.toString(), 0);
                    const categoryName = (req.query.categoryName === undefined) ? "" : req.query.categoryName.toString();
                    const startDate = (req.query.startDate === undefined) ? null : new Date(req.query.startDate.toString());
                    const endDate = (req.query.endDate === undefined) ? null : new Date(req.query.endDate.toString());
                    const groupBy = (req.query.groupBy === undefined) ? "" : req.query.groupBy.toString();
                    const trend = (req.query.trend === undefined) ? false : req.query.trend.toString() === "true";
                    result = await this.repositories.attendance.load(au.churchId, campusId, serviceId, serviceTimeId, categoryName, groupId, startDate, endDate, groupBy, trend);
                }
            }
            console.log(result);
            return this.repositories.attendance.convertAllToModel(au.churchId, result);
        });
    }

}
