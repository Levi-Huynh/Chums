import React from 'react';
import { ApiHelper, GroupInterface, DisplayBox, UserHelper, GroupMemberInterface, PersonHelper, PersonInterface, ExportLink } from './';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';


interface Props {
    group: GroupInterface,
    addedPerson?: PersonInterface,
    addedCallback?: () => void
}

export const GroupMembers: React.FC<Props> = (props) => {

    const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);

    const loadData = React.useCallback(() => { ApiHelper.apiGet('/groupmembers?groupId=' + props.group.id).then(data => setGroupMembers(data)); }, [props.group]);
    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        var members = [...groupMembers];
        var member = members.splice(idx, 1)[0];
        setGroupMembers(members);
        ApiHelper.apiDelete('/groupmembers/' + member.id);
    }

    //*** Is there a good way to globally attach methods like this to the GroupMembers interface?
    const getMemberByPersonId = React.useCallback((personId: number) => {
        var result = null;
        for (var i = 0; i < groupMembers.length; i++) if (groupMembers[i].personId === personId) result = groupMembers[i];
        return result;
    }, [groupMembers]);

    const handleAdd = React.useCallback(() => {
        if (getMemberByPersonId(props.addedPerson.id) === null) {
            var gm = { groupId: props.group.id, personId: props.addedPerson.id, person: props.addedPerson } as GroupMemberInterface
            ApiHelper.apiPost('/groupmembers', [gm]);
            var members = [...groupMembers];
            members.push(gm);
            setGroupMembers(members);
            props.addedCallback();
        }
    }, [props, getMemberByPersonId, groupMembers]);

    const getRows = () => {
        var canEdit = UserHelper.checkAccess('Group Members', 'Edit');
        var rows = [];
        for (let i = 0; i < groupMembers.length; i++) {
            var gm = groupMembers[i];
            var editLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} className="text-danger" ><i className="fas fa-user-times"></i> Remove</a> : <></>
            rows.push(
                <tr key={i}>
                    <td><img src={PersonHelper.getPhotoUrl(gm.person)} alt="avatar" /></td>
                    <td><Link to={"/people/" + gm.personId}>{gm.person.displayName}</Link></td>
                    <td>{editLink}</td>
                </tr>
            );
        }
        return rows;
    }

    const getEditContent = () => { return (<ExportLink data={groupMembers} spaceAfter={true} filename="groupmembers.csv" />) }

    React.useEffect(() => { if (props.group.id !== undefined) loadData(); }, [props.group, loadData]);
    React.useEffect(() => { if (props.addedPerson?.id !== undefined) handleAdd() }, [props.addedPerson, handleAdd]);

    return (
        <DisplayBox id="groupMembersBox" headerText="Group Members" headerIcon="fas fa-users" editContent={getEditContent()} >
            <Table id="groupMemberTable">
                <thead><tr><th></th><th>Name</th><th>Action</th></tr></thead>
                <tbody>{getRows()}</tbody>
            </Table>
        </DisplayBox>
    );
}

