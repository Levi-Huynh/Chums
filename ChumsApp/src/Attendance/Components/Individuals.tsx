import React from 'react';
import { DisplayBox, PersonInterface, AttendanceHelper, AttendanceFilterInterface, PersonHelper, ExportLink } from './';
import { Table } from 'react-bootstrap'

interface Props { filter: AttendanceFilterInterface }

export const Individuals: React.FC<Props> = (props) => {
    const [people, setPeople] = React.useState<PersonInterface[]>([]);

    const loadData = () => { AttendanceHelper.loadIndividuals(props.filter).then(data => setPeople(data)); }

    const getRows = () => {
        var rows: JSX.Element[] = [];
        for (let i = 0; i < people.length; i++) {
            var p = people[i];
            rows.push(<tr>
                <td><img src={PersonHelper.getPhotoUrl(p)} alt="avatar" /></td>
                <td>{p.displayName}</td>
            </tr>);
        }
        return rows;
    }

    const getEditContent = () => { return (<ExportLink data={people} filename="attendance.csv" />) }

    React.useEffect(loadData, [props.filter]);

    return (
        <DisplayBox id="individualAttendanceBox" headerIcon="fas fa-user" headerText="People" editContent={getEditContent()} >
            <p className="text-right">Total Attendance: {people.length}</p>
            <Table size="sm" id="peopleTable">
                <thead><tr><th></th><th>Name</th></tr></thead>
                <tbody>{getRows()}</tbody>
            </Table>
        </DisplayBox>
    );
}

