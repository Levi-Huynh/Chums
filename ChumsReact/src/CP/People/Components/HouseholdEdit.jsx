import React from 'react';
import InputBox from '../../Components/InputBox';
import PersonAdd from '../../Components/PersonAdd';
import PersonHelper from '../../../Utils/PersonHelper';
import ApiHelper from '../../../Utils/ApiHelper';

const HouseholdEdit = (props) => {
    const [household, setHousehold] = React.useState({});
    const [members, setMembers] = React.useState([]);
    const [showAdd, setShowAdd] = React.useState(false);
    const [dummy, setDummy] = React.useState(null);

    //***I'm cloning the object because otherwise setHoushold won't trigger a re-render.  Is there a better way?
    const handleChange = (e) => { let h = { ...household }; h.name = e.target.value; setHousehold(h); }
    const handleCancel = (e) => { e.preventDefault(); props.updatedFunction(); }
    const handleAdd = (e) => { e.preventDefault(); setShowAdd(true); }

    const handleRemove = (e) => {
        e.preventDefault();
        var idx = e.target.parentNode.parentNode.getAttribute('data-index');
        var m = [].concat(members);
        m.splice(idx, 1);
        setMembers(m);
    }

    const handleChangeRole = (e) => {
        var idx = e.target.parentNode.parentNode.getAttribute('data-index');
        var m = [].concat(members); //***Is this the best way to handle cloning
        m[idx].role = e.target.value;
        setMembers(m);
    }

    const handlePersonAdd = (person) => {
        var member = { householdId: household.id, personId: person.id, person: person, role: 'Other' };
        var m = [].concat(members);
        m.push(member);
        setMembers(m);
    }

    const handleSave = (e) => {
        e.preventDefault();
        var promises = [];
        promises.push(ApiHelper.apiPost('/households', [household]));
        promises.push(ApiHelper.apiPost('/householdmembers/' + household.id, members));
        Promise.all(promises).then(() => props.updatedFunction());
    }

    React.useEffect(() => setMembers(props.members), [props.members]);
    React.useEffect(() => setHousehold(props.household), [props.household]);

    var rows = [];
    if (members !== null) {
        for (var i = 0; i < members.length; i++) {
            var m = members[i];
            rows.push(
                <tr key={m.id} data-index={i} >
                    <td><img src={PersonHelper.getPhotoUrl(m.personId, m.person.photoUpdated)} alt="avatar" /></td>
                    <td>
                        {m.person.displayName}
                        <select value={m.role} onChange={handleChangeRole} className="form-control form-control-sm">
                            <option value="Head">Head</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Other">Other</option>
                        </select>
                    </td>
                    <td><a href="#" onClick={handleRemove} className="text-danger"><i className="fas fa-user-times"></i> Remove</a></td>
                </tr>
            );
        }
    }

    var personAdd = (showAdd) ? <PersonAdd addFunction={handlePersonAdd} /> : null;
    return (
        <InputBox headerIcon="fas fa-users" headerText={household.name + " Household"} saveFunction={handleSave} cancelFunction={handleCancel} >
            <div className="form-group">
                <label>Household Name</label>
                <input type="text" className="form-control" value={household.name} onChange={handleChange} />
            </div>
            <table className="table table-sm" id="householdMemberTable"><tbody>
                {rows}
                <tr>
                    <td></td>
                    <td></td>
                    <td><a href="#" className="text-success" onClick={handleAdd}> <i className="fas fa-user"></i> Add</a></td>
                </tr>
            </tbody></table>
            {personAdd}

        </InputBox >
    );
}

export default HouseholdEdit;
