import React from 'react';
import { DisplayBox, ReportInterface, ReportGroupings } from '.';
import { ReportHelper } from '../../Utils';
import { Chart } from 'react-google-charts';
import { ReportFilter } from './ReportFilter';

interface Props { report?: ReportInterface }

export const BarChart = (props: Props) => {

    const getChartData = () => {
        const records = props.report.results;
        if (records === undefined) return null;
        const groupings = new ReportGroupings(props.report);
        var rows: any[] = [];
        getChartHeader(rows, groupings);
        getChartRows(rows, records, groupings);
        return rows;
    }

    const getChartHeader = (rows: any[], groupings: ReportGroupings) => {
        if (groupings.secondaryCol === null) {
            var header: any[] = ['Grouping', groupings.valueCol.heading, { role: 'annotation' }];
            rows.push(header);
        } else {
            var header: any[] = ["Grouping"];
            for (let i = 0; i < groupings.secondaryGroupValues.length; i++) header.push(groupings.secondaryGroupValues[i]);
            header.push({ role: "annotation" });
            rows.push(header);
        }
    }

    const getChartRows = (rows: any[], records: any, groupings: ReportGroupings) => {
        for (let i = 0; i < groupings.primaryGroupValues.length; i++) {
            var primaryName = ReportHelper.getPrettyValue(groupings.primaryCol, groupings.primaryGroupValues[i]);
            var row: any[] = [primaryName];

            if (groupings.secondaryCol === null) {
                var record: any = ReportHelper.getSingleRecord(records, groupings.primaryCol, groupings.primaryGroupValues[i]);
                row.push((record === null) ? 0 : record[groupings.valueCol.field]);
            } else {
                var primaryRecords = ReportHelper.getFilteredRecords(records, groupings.primaryCol, groupings.primaryGroupValues[i]);

                for (let j = 0; j < groupings.secondaryGroupValues.length; j++) {
                    var secondaryRecord: any = ReportHelper.getSingleRecord(primaryRecords, groupings.secondaryCol, groupings.secondaryGroupValues[j]);
                    row.push((secondaryRecord === null) ? 0 : secondaryRecord[groupings.valueCol.field]);
                }
            }
            row.push('');
            rows.push(row);
        }
    }


    var result = <></>

    switch (props.report.reportType) {
        case "Area Chart":
            result = (<Chart chartType="AreaChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: 'top', maxLines: 3 }, bar: { groupWidth: '75%' }, isStacked: true }} />);
            break;
        default:
            result = (<Chart chartType="ColumnChart" data={getChartData()} width="100%" height="400px" options={{ height: 400, legend: { position: 'top', maxLines: 3 }, bar: { groupWidth: '75%' }, isStacked: true }} />);
            break;
    }
    return result;


}
