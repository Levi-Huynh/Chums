import { ApiHelper, Helper, AttendanceRecordInterface } from "./";

export interface AttendanceFilterInterface {
    campusId?: number,
    serviceId?: number,
    serviceTimeId?: number,
    categoryName?: string
    groupId?: number
    startDate?: Date
    endDate?: Date,
    groupBy?: string
    trend?: boolean
}

export class AttendanceHelper {

    //***is there a better way to set these default values?
    static populateMissing(filter: AttendanceFilterInterface) {
        if (filter.campusId === undefined) filter.campusId = 0;
        if (filter.serviceId === undefined) filter.serviceId = 0;
        if (filter.serviceTimeId === undefined) filter.serviceTimeId = 0;
        if (filter.categoryName === undefined) filter.categoryName = '';
        if (filter.groupId === undefined) filter.groupId = 0;
        if (filter.startDate === undefined) filter.startDate = new Date(2000, 1, 1);
        if (filter.endDate === undefined) filter.endDate = new Date();
        if (filter.groupBy === undefined) filter.groupBy = 'CampusName';
        if (filter.trend === undefined) filter.trend = true;
    }

    static loadData(filter: AttendanceFilterInterface): Promise<any> {
        AttendanceHelper.populateMissing(filter);


        var url = '/attendancerecords'
            + '?campusId=' + filter.campusId
            + '&serviceId=' + filter.serviceId
            + '&serviceTimeId=' + filter.serviceTimeId
            + '&categoryName=' + filter.categoryName
            + '&groupId=' + filter.groupId
            + '&startDate=' + Helper.formatHtml5Date(filter.startDate)
            + '&endDate=' + Helper.formatHtml5Date(filter.endDate)
            + '&groupBy=' + filter.groupBy
            + '&trend=' + filter.trend;
        return ApiHelper.apiGet(url);
    }

    static getDisplayName(record: AttendanceRecordInterface) {
        if (record.group !== undefined && record.group.name !== '') return record.group.name;
        else if (record.group !== undefined && record.group.categoryName !== '') return record.group.categoryName;
        else if (record.serviceTime !== undefined && record.serviceTime.name !== '') return record.serviceTime.name;
        else if (record.service !== undefined && record.service.name !== '') return record.service.name;
        else if (record.campus !== undefined && record.campus.name !== '') return record.campus.name;
    }
}