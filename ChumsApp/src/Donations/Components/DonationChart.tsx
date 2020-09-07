import React from 'react';
import { ApiHelper, DonationSummaryInterface, Helper } from './';
import { DisplayBox } from './';
import { Chart } from 'react-google-charts';

interface Props { startDate: Date, endDate: Date }
export const DonationChart: React.FC<Props> = (props) => {
    const [records, setRecords] = React.useState<DonationSummaryInterface[]>([]);

    const loadData = () => { ApiHelper.apiGet('/donations/summary?startDate=' + Helper.formatHtml5Date(props.startDate) + '&endDate=' + Helper.formatHtml5Date(props.endDate)).then(data => setRecords(data)); }

    const getWeekRecords = (weekNum: number) => {
        var result: DonationSummaryInterface[] = [];
        for (let i = 0; i < records.length; i++) if (records[i].week === weekNum) result.push(records[i]);
        return result;
    }

    const getNameRecord = (weekRecords: DonationSummaryInterface[], fundName: string) => {
        for (let i = 0; i < weekRecords.length; i++) if (weekRecords[i].fund.name === fundName) return weekRecords[i];
        return null;
    }

    const getChartRows = () => {
        var fundNames: string[] = [];
        var weeks: number[] = [];
        for (let i = 0; i < records.length; i++) {
            var displayName = records[i].fund.name;
            if (fundNames.indexOf(displayName) === -1) fundNames.push(displayName);
            if (weeks.indexOf(records[i].week) === -1) weeks.push(records[i].week);
        }
        var rows = [];
        var header: any[] = ['Grouping'];
        for (let i = 0; i < fundNames.length; i++) header.push(fundNames[i]);
        header.push({ role: 'annotation' });
        rows.push(header);
        for (let i = 0; i < weeks.length; i++) {
            var weekRecords: DonationSummaryInterface[] = getWeekRecords(weeks[i]);
            var weekName = Helper.prettyDate(Helper.getWeekSunday(new Date().getFullYear(), weeks[i]));
            var row: any[] = [weekName];
            for (let j = 0; j < fundNames.length; j++) {
                var nameRecord: DonationSummaryInterface = getNameRecord(weekRecords, fundNames[j]);
                row.push((nameRecord === null) ? 0 : nameRecord.totalAmount);
            }
            row.push('');
            rows.push(row);
        }
        return rows;
    }

    React.useEffect(loadData, [props.startDate, props.endDate]);

    return (
        <DisplayBox id="donationChartBox" headerIcon="fas fa-hand-holding-usd" headerText="Donation History" >
            <Chart
                chartType="ColumnChart"
                data={getChartRows()}
                width="100%"
                height="400px"
                options={{ height: 400, legend: { position: 'top', maxLines: 3 }, bar: { groupWidth: '75%' }, isStacked: true }}
            />
        </DisplayBox>
    );
}

