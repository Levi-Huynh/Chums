import { ReportInterface, ReportColumnInterface } from ".";



export class ReportGroupings {

    public primaryCol: ReportColumnInterface = null;
    public secondaryCol: ReportColumnInterface = null;
    public valueCol: ReportColumnInterface = null;
    public primaryGroupValues: any[] = [];
    public secondaryGroupValues: any[] = [];


    public constructor(report: ReportInterface) {
        const records = report.results;
        if (records !== undefined) {

            this.primaryCol = report.columns[0];
            this.secondaryCol = null;
            this.valueCol = report.columns[1];
            if (report.columns[1].grouped) {
                this.secondaryCol = report.columns[1];
                this.valueCol = report.columns[2];
            }

            this.primaryGroupValues = [];
            this.secondaryGroupValues = [];
            for (let i = 0; i < records.length; i++) {
                var primaryValue = records[i][this.primaryCol.field];
                if (this.primaryGroupValues.indexOf(primaryValue) === -1) this.primaryGroupValues.push(primaryValue);

                if (this.secondaryCol !== null) {
                    var secondaryValue = records[i][this.secondaryCol.field];
                    if (this.secondaryGroupValues.indexOf(secondaryValue) === -1) this.secondaryGroupValues.push(secondaryValue);
                }
            }

        }
    }


}