import React from 'react';
import { ApiHelper, DisplayBox, UserHelper, RoleMemberInterface, PersonHelper, PersonInterface, RoleInterface, ExportLink } from './';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

interface Props { role: RoleInterface, addedPerson?: PersonInterface, addedCallback?: () => void }

export const RoleMembers: React.FC<Props> = (props) => {

    const [roleMembers, setRoleMembers] = React.useState<RoleMemberInterface[]>([]);

    const loadData = () => ApiHelper.apiGet('/rolemembers?roleId=' + props.role.id).then(data => setRoleMembers(data));
    const getEditContent = () => { return (<ExportLink data={roleMembers} spaceAfter={true} filename="rolemembers.csv" />) }
    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        var members = [...roleMembers];
        var member = members.splice(idx, 1)[0];
        setRoleMembers(members);
        ApiHelper.apiDelete('/rolemembers/' + member.id);
    }

    const getMemberByPersonId = (personId: number) => {
        var result = null;
        for (var i = 0; i < roleMembers.length; i++) if (roleMembers[i].personId === personId) result = roleMembers[i];
        return result;
    }

    const handleAdd = () => {
        if (getMemberByPersonId(props.addedPerson.id) === null) {
            var rm = { roleId: props.role.id, personId: props.addedPerson.id, person: props.addedPerson } as RoleMemberInterface
            ApiHelper.apiPost('/rolemembers', [rm]);
            var members = [...roleMembers];
            members.push(rm);
            setRoleMembers(members);
            props.addedCallback();
        }
    }

    const getRows = () => {
        var canEdit = UserHelper.checkAccess('Group Members', 'Edit');
        var rows = [];
        for (let i = 0; i < roleMembers.length; i++) {
            var rm = roleMembers[i];
            var editLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} className="text-danger" ><i className="fas fa-user-times"></i> Remove</a> : <></>
            rows.push(
                <tr key={i}>
                    <td><img src={PersonHelper.getPhotoUrl(rm.person)} alt="avatar" /></td>
                    <td><Link to={"/people/" + rm.personId}>{rm.person.displayName}</Link></td>
                    <td>{editLink}</td>
                </tr>
            );
        }
        return rows;
    }


    React.useEffect(() => { if (props.role.id !== undefined) loadData() }, [props.role]);
    React.useEffect(() => { if (props.addedPerson?.id !== undefined) handleAdd() }, [props.addedPerson]);

    return (
        <DisplayBox headerText="Members" headerIcon="fas fa-users" editContent={getEditContent()} >
            <Table id="roleMemberTable">
                <thead><tr><th></th><th>Name</th><th>Action</th></tr></thead>
                <tbody>{getRows()}</tbody>
            </Table>
        </DisplayBox>
    );
}

