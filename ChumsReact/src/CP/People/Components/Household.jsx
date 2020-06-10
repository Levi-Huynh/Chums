import React from 'react';
import DisplayBox from '../../Components/DisplayBox';
import PersonHelper from '../../../Utils/PersonHelper';
import ApiHelper from '../../../Utils/ApiHelper';
import { Link } from 'react-router-dom';
import HouseholdEdit from './HouseholdEdit';

const Household = (props) => {
    const [household, setHousehold] = React.useState(null);
    const [members, setMembers] = React.useState(null);
    const [mode, setMode] = React.useState('display');

    const handleEdit = e => { e.preventDefault(); setMode('edit'); }
    const handleUpdate = () => { loadData(); loadMembers(); setMode('display'); }
    const loadData = () => { if (props.personId > 0) ApiHelper.apiGet('/households?personId=' + props.personId).then(data => setHousehold(data[0])); }
    const loadMembers = () => { if (household != null) ApiHelper.apiGet('/householdmembers?householdId=' + household.id).then(data => setMembers(data)); }

    React.useEffect(() => loadData(), [props.personId]);
    React.useEffect(() => loadMembers(), [household?.id]);

    var rows = [];
    if (mode === 'display') {
        if (members !== null) {
            for (var i = 0; i < members.length; i++) {
                var m = members[i];
                rows.push(
                    <tr key={m.id}>
                        <td><img src={PersonHelper.getPhotoUrl(m.personId, m.person.photoUpdated)} alt="avatar" /></td>
                        <td><Link to={"/cp/people/" + m.personId}>{m.person.displayName}</Link><div>{m.role}</div></td>
                    </tr>
                );
            }
        }
        return (
            <DisplayBox headerIcon="fas fa-users" headerText={(household?.name || '') + " Household"} editFunction={handleEdit} >
                <table id="household" className="table table-sm"><tbody>{rows}</tbody></table>
            </DisplayBox>
        );
    }
    else return <HouseholdEdit household={household} members={members} updatedFunction={handleUpdate} />
}

export default Household;