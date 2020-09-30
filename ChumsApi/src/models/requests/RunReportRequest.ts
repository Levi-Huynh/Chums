import { ReportValue } from "../ReportValue";

export type RunReportRequest = {
    id?: number;
    keyName?: string;
    values?: ReportValue[]
};
