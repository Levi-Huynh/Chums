import React from 'react';
import { DisplayBox, ApiHelper, AttendanceRecordInterface, Helper } from './';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

interface Props { personId: number }

export const PersonAttendance: React.FC<Props> = (props) => {
    const [records, setRecords] = React.useState<AttendanceRecordInterface[]>([]);

    const loadData = () => { if (props.personId > 0) ApiHelper.apiGet('/attendancerecords?personId=' + props.personId).then(data => setRecords(data)); }
    const getRows = () => {
        var rows: JSX.Element[] = [];

        var lastVisitDate = new Date(2000, 1, 1);
        var lastCampusId = -1;
        var lastServiceId = -1;

        for (let i = 0; i < records.length; i++) {
            var r = records[i];
            var cols: JSX.Element[] = [];
            var showRest = false;
            if (r.visitDate === lastVisitDate && !showRest) cols.push(<td></td>);
            else {
                cols.push(<td><i className="far fa-calendar-alt"></i> {Helper.formatHtml5Date(r.visitDate)}</td>);
                lastVisitDate = r.visitDate;
                showRest = true;
            }
            if (r.campus?.id === lastCampusId && !showRest) cols.push(<td></td>);
            else {
                cols.push(<td><i className="fas fa-church"></i> {r.campus?.name}</td>);
                lastCampusId = r.campus?.id;
                showRest = true;
            }
            if (r.service?.id === lastServiceId && !showRest) cols.push(<td></td>);
            else {
                cols.push(<td><i className="fas fa-calendar-alt"></i> {r.service?.name}</td>);
                lastServiceId = r.service?.id;
                showRest = true;
            }
            if (r.serviceTime === undefined) cols.push(<td></td>);
            else cols.push(<td><i className="far fa-clock"></i> {r.serviceTime?.name}</td>);
            cols.push(<td><i className="fas fa-list"></i> <Link to={"/groups/" + r.group.id}>{r.group.name}</Link></td>)
            rows.push(<tr>{cols}</tr>);
        }
        return rows;
    }

    React.useEffect(loadData, [props.personId]);

    return (
        <DisplayBox headerIcon="far fa-calendar-alt" headerText="Attendance" >
            <Table><tbody>{getRows()}</tbody></Table>
        </DisplayBox>
    );
}

