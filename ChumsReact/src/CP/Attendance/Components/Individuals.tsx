import React from 'react';
import { DisplayBox, ApiHelper, AttendanceRecordInterface, Helper } from './';
import { PersonInterface, AttendanceHelper, AttendanceFilterInterface, PersonHelper } from '../../../Utils';

interface Props { filter: AttendanceFilterInterface }

export const Individuals: React.FC<Props> = (props) => {

    const [people, setPeople] = React.useState<PersonInterface[]>([]);

    const loadData = () => { AttendanceHelper.loadIndividuals(props.filter).then(data => setPeople(data)); }

    React.useEffect(() => loadData(), [props.filter]);

    const getRows = () => {
        var rows: JSX.Element[] = [];

        for (let i = 0; i < people.length; i++) {
            var p = people[i];
            rows.push(<tr>
                <td><img src={PersonHelper.getPhotoUrl(p.id, p.photoUpdated)} /></td>
                <td>{p.displayName}</td>
            </tr>);
        }
        return rows;
    }


    return (
        <DisplayBox headerIcon="fas fa-user" headerText="People" >
            <p className="text-right">Total Attendance: {people.length}</p>
            <table className="table table-sm" id="peopleTable">
                <tr><th></th><th>Name</th></tr>
                {getRows()}
            </table>
        </DisplayBox>
    );
}

