import React from 'react';
import { DisplayBox, PersonHelper, ApiHelper, HouseholdEdit, UserHelper } from './';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

interface Props { personId: number, reload: any }

export const Household: React.FC<Props> = (props) => {
    const [household, setHousehold] = React.useState(null);
    const [members, setMembers] = React.useState(null);
    const [mode, setMode] = React.useState('display');

    const handleEdit = () => setMode('edit');
    const handleUpdate = () => { loadData(); loadMembers(); setMode('display'); }
    const loadData = () => { if (props.personId > 0) ApiHelper.apiGet('/households?personId=' + props.personId).then(data => setHousehold(data[0])); }
    const loadMembers = () => { if (household != null) { ApiHelper.apiGet('/householdmembers?householdId=' + household.id).then(data => setMembers(data)); } }
    const getEditFunction = () => { return (UserHelper.checkAccess('Households', 'Edit')) ? handleEdit : null }

    React.useEffect(loadData, [props.personId]);
    React.useEffect(loadMembers, [household?.id | props.reload]);

    var rows = [];
    if (mode === 'display') {
        if (members !== null) {
            for (var i = 0; i < members.length; i++) {
                var m = members[i];
                rows.push(
                    <tr key={m.id}>
                        <td><img src={PersonHelper.getPhotoUrl(m.person)} alt="avatar" /></td>
                        <td><Link to={"/people/" + m.personId}>{m.person.displayName}</Link><div>{m.role}</div></td>
                    </tr>
                );
            }
        }
        return (
            <DisplayBox headerIcon="fas fa-users" headerText={(household?.name || '') + " Household"} editFunction={getEditFunction()} >
                <Table size="sm" id="household"><tbody>{rows}</tbody></Table>
            </DisplayBox>
        );
    }
    else return <HouseholdEdit household={household} members={members} updatedFunction={handleUpdate} />
}

