import React from 'react';
import DisplayBox from '../../Components/DisplayBox'
import ApiHelper from '../../../Utils/ApiHelper';
import { Link } from 'react-router-dom';

class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.state = { groupMembers: null };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.personId !== this.props.personId) {
            ApiHelper.apiGet('/groupmembers?personId=' + this.props.personId).then(data => {
                this.setState({ groupMembers: data });
            })
        }
    }

    render() {
        const items = [];
        if (this.state.groupMembers !== null) {
            for (var i = 0; i < this.state.groupMembers.length; i++) {
                var gm = this.state.groupMembers[i];
                items.push(<tr><td><i class="fas fa-list"></i> <Link to={"/cp/groups/group/" + gm.groupId}>{gm.group.name}</Link></td></tr>);
            }
        }

        return (

            <DisplayBox headerIcon="fas fa-list" headerText="Groups">
                <table className="table table-sm">
                    {items}
                </table>
            </DisplayBox>

        )
    }
}

export default Groups;