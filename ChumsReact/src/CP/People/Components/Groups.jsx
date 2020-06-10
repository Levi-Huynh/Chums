import React from 'react';
import DisplayBox from '../../Components/DisplayBox'
import ApiHelper from '../../../Utils/ApiHelper';
import { Link } from 'react-router-dom';

const Groups = (props) => {
    const [groupMembers, setGroupMembers] = React.useState(null);

    React.useEffect(() => {
        if (props.personId > 0) ApiHelper.apiGet('/groupmembers?personId=' + props.personId).then(data => setGroupMembers(data))
    }, [props.personId]);

    const items = [];
    if (groupMembers !== null) {
        for (var i = 0; i < groupMembers.length; i++) {
            var gm = groupMembers[i];
            items.push(<tr key={gm.id}><td><i className="fas fa-list"></i> <Link to={"/cp/groups/group/" + gm.groupId}>{gm.group.name}</Link></td></tr>);
        }
    }

    return <DisplayBox headerIcon="fas fa-list" headerText="Groups"><table className="table table-sm"><tbody>{items}</tbody></table></DisplayBox>
}


export default Groups;