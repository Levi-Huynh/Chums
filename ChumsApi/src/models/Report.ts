import { ReportColumn } from './';

export class Report {
    public id?: number;
    public keyName?: string;
    public title?: string;
    public query?: string;
    public parameters?: string;
    public reportType?: string;
    public columns?: ReportColumn[];
    public groupLevels?: number;
    public results?: any[];
}
