import React, { ChangeEvent } from 'react';
import { InputBox, PersonAdd, PersonHelper, ApiHelper, HouseholdInterface, HouseholdMemberInterface, PersonInterface } from './';
import { Table } from 'react-bootstrap';

interface Props { updatedFunction: () => void, household: HouseholdInterface, members: [HouseholdMemberInterface] }

export const HouseholdEdit: React.FC<Props> = (props) => {
    const [household, setHousehold] = React.useState<HouseholdInterface>({} as HouseholdInterface);
    const [members, setMembers] = React.useState<HouseholdMemberInterface[]>([]);
    const [showAdd, setShowAdd] = React.useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => { let h = { ...household }; h.name = e.currentTarget.value; setHousehold(h); }
    const handleCancel = () => { props.updatedFunction(); }
    const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); setShowAdd(true); }

    const handleRemove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        var target = e.currentTarget as HTMLElement;
        var row = target.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var m = [...members];
        m.splice(idx, 1);
        setMembers(m);
    }

    const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
        var row = e.currentTarget.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var m = [...members];
        m[idx].role = e.currentTarget.value;
        setMembers(m);
    }

    const handlePersonAdd = (person: PersonInterface) => {
        var member = { householdId: household.id, personId: person.id, person: person, role: 'Other' };
        var m = [...members];
        m.push(member);
        setMembers(m);
    }

    const handleSave = () => {
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
                    <td><img src={PersonHelper.getPhotoUrl(m.person)} alt="avatar" /></td>
                    <td>
                        {m.person.displayName}
                        <select value={m.role} onChange={handleChangeRole} className="form-control form-control-sm">
                            <option value="Head">Head</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Other">Other</option>
                        </select>
                    </td>
                    <td><a href="about:blank" onClick={handleRemove} className="text-danger"><i className="fas fa-user-times"></i> Remove</a></td>
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
            <Table size="sm" id="householdMemberTable">
                <tbody>
                    {rows}
                    <tr><td></td><td></td><td><a href="about:blank" className="text-success" onClick={handleAdd}> <i className="fas fa-user"></i> Add</a></td></tr>
                </tbody>
            </Table>
            {personAdd}
        </InputBox >
    );
}
