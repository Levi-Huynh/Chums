import React, { ReactNodeArray } from 'react';
import { ApiHelper, Note, DisplayBox, InputBox, UserHelper, AttendanceRecordInterface } from './';
import { Helper } from '../../Utils';
import { Chart } from 'react-google-charts';
import { AttendanceHelper, AttendanceFilterInterface } from '../../Utils/AttendanceHelper';

interface Props { contentId?: number, contentType?: string }


export const Attendance: React.FC<Props> = (props) => {

    const [filter, setFilter] = React.useState<AttendanceFilterInterface>({});
    const [records, setRecords] = React.useState<AttendanceRecordInterface[]>([]);

    /*
    const [notes, setNotes] = React.useState([]);
    const [noteText, setNoteText] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value);
    const loadNotes = () => { if (props.contentId > 0) ApiHelper.apiGet('/notes/' + props.contentType + '/' + props.contentId).then(data => setNotes(data)); }
    const handleSave = () => {
        var n = { contentId: props.contentId, contentType: props.contentType, contents: noteText }
        ApiHelper.apiPost('/notes', [n]).then(() => { loadNotes(); setNoteText(''); });
    }
    

    var noteArray: React.ReactNode[] = [];
    for (var i = 0; i < notes.length; i++) noteArray.push(<Note note={notes[i]} key={notes[i].id} />);
*/



    const loadData = () => {
        AttendanceHelper.loadData(filter).then((data: AttendanceRecordInterface[]) => setRecords(data))
    }

    const getWeekRecords = (weekNum: number) => {
        var result: AttendanceRecordInterface[] = [];
        for (let i = 0; i < records.length; i++) if (records[i].week === weekNum) result.push(records[i]);
        return result;
    }

    const getNameRecord = (weekRecords: AttendanceRecordInterface[], displayName: string) => {
        for (let i = 0; i < weekRecords.length; i++) if (AttendanceHelper.getDisplayName(weekRecords[i]) === displayName) return weekRecords[i];
        return null;
    }

    const getChartRows = () => {
        var displayNames: string[] = [];
        var weeks: number[] = [];
        for (let i = 0; i < records.length; i++) {
            var displayName = AttendanceHelper.getDisplayName(records[i]);
            if (displayNames.indexOf(displayName) == -1) displayNames.push(displayName);
            if (weeks.indexOf(records[i].week) == -1) weeks.push(records[i].week);
        }

        var rows = [];

        var header: any[] = ['Grouping'];
        for (let i = 0; i < displayNames.length; i++) header.push(displayNames[i]);
        header.push({ role: 'annotation' });
        rows.push(header);

        for (let i = 0; i < weeks.length; i++) {
            var weekRecords: AttendanceRecordInterface[] = getWeekRecords(weeks[i]);
            var weekName = Helper.formatHtml5Date(Helper.getWeekSunday(new Date().getFullYear(), weeks[i]));
            var row: any[] = [weekName];
            for (let j = 0; j < displayNames.length; j++) {
                var nameRecord: AttendanceRecordInterface = getNameRecord(weekRecords, displayNames[j]);
                row.push((nameRecord === null) ? 0 : nameRecord.count);
            }
            row.push('');
            rows.push(row);
        }
        return rows;
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        var f = { ...filter } as AttendanceFilterInterface;
        f.groupBy = e.target.value;
        setFilter(f);
    }


    React.useEffect(loadData, [filter]);
    //React.useEffect(drawChart, [records]);

    return (
        <DisplayBox headerIcon="far fa-calendar-alt" headerText="Attendance History" >
            <div className="row">
                <div className="col-lg-6 offset-lg-6">
                    <div className="form-group">
                        <label>Grouping</label>
                        <select className="form-control" value={filter.groupBy} onChange={handleChange} >
                            <option value="CampusName">Campus</option>
                            <option value="ServiceName">Service</option>
                            <option value="ServiceTimeName">Service Time</option>
                            <option value="CategoryName">Category</option>
                            <option value="GroupName">Group</option>
                            <option value="Gender">Gender</option>
                        </select>
                    </div>
                </div>
            </div>
            <Chart
                chartType="Bar"
                data={getChartRows()}
                width="100%"
                height="400px"
                options={{ height: 400, legend: { position: 'top', maxLines: 3 }, bar: { groupWidth: '75%' }, isStacked: true }}
            />
        </DisplayBox>
    )
}

