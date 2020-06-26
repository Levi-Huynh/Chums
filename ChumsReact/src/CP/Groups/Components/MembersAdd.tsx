import React from 'react';
import { Link } from 'react-router-dom';
import { ApiHelper, GroupInterface, DisplayBox, GroupMemberInterface, PersonHelper } from './';
import { PersonInterface } from '../../../Utils';

interface Props { group: GroupInterface, addFunction: (person: PersonInterface) => void }

export const MembersAdd: React.FC<Props> = (props) => {
    const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);

    const loadData = () => ApiHelper.apiGet('/groupmembers?groupId=' + props.group.id).then(data => setGroupMembers(data));
    const addMember = (e: React.MouseEvent) => {

        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        var gm = groupMembers;
        var person = gm.splice(idx, 1)[0].person;
        setGroupMembers(gm);
        props.addFunction(person);

    }

    const getRows = () => {
        var rows = [];
        for (let i = 0; i < groupMembers.length; i++) {
            var gm = groupMembers[i];
            rows.push(
                <tr key={i}>
                    <td><img src={PersonHelper.getPhotoUrl(gm.personId, gm.person.photoUpdated)} alt="avatar" /></td>
                    <td><Link to={"/cp/people/" + gm.personId}>{gm.person.displayName}</Link></td>
                    <td><a href="about:blank" className="text-success" onClick={addMember} data-index={i}><i className="fas fa-user"></i> Add</a></td>
                </tr>
            );
        }
        return rows;
    }

    React.useEffect(() => { if (props.group !== null) loadData() }, [props.group]);

    return (
        <DisplayBox headerIcon="fas fa-user" headerText="Available Group Members" >
            <table className="table personSideTable">
                <tbody>
                    <tr><th></th><th>Name</th><th>Action</th></tr>
                    {getRows()}
                </tbody>
            </table>
        </DisplayBox>

    );
}

