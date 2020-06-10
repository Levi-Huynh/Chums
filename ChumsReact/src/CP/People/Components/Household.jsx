import React from 'react';
import DisplayBox from '../../Components/DisplayBox';
import PersonHelper from '../../../Utils/PersonHelper';
import ApiHelper from '../../../Utils/ApiHelper';
import { Link } from 'react-router-dom';
import HouseholdEdit from './HouseholdEdit';

class Household extends React.Component {

    constructor(props) {
        super(props);
        this.state = { mode: 'display', household: null };

        this.loadData = this.loadData.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.personId !== this.props.personId) {
            this.loadData();
        }
    }

    loadData() {
        if (this.props.personId > 0) {
            //**TODO: Combine as many requests as possible into the initial person request on the parent page.
            ApiHelper.apiGet('/households?personId=' + this.props.personId).then(data => {
                this.setState({ household: data[0] });
                ApiHelper.apiGet('/householdmembers?householdId=' + this.state.household.id).then(d => {
                    this.setState({ members: d });
                });
            });
        }
    }
    handleEdit(e) {
        e.preventDefault();
        this.setState({ mode: 'edit' });
    }

    handleUpdate(person, e) {
        if (e !== undefined) e.preventDefault();
        this.loadData();
        this.setState({ mode: 'display' });
        //if (person !== null) this.setState({ person: person });
    }

    render() {
        var rows = [];

        if (this.state.mode === 'display') {
            if (this.state.members !== undefined) {
                for (var i = 0; i < this.state.members.length; i++) {
                    var m = this.state.members[i];
                    rows.push(
                        <tr key={m.id}>
                            <td><img src={PersonHelper.getPhotoUrl(m.personId, m.person.photoUpdated)} alt="avatar" /></td>
                            <td><Link to={"/cp/people/" + m.personId}>{m.person.displayName}</Link><div>{m.role}</div></td>
                        </tr>
                    );
                }
            }
            return (
                <DisplayBox headerIcon="fas fa-users" headerText={(this.state.household?.name || '') + " Household"} editFunction={this.handleEdit} >
                    <table id="household" className="table table-sm"><tbody>{rows}</tbody></table>
                </DisplayBox>
            );
        }
        else return <HouseholdEdit household={this.state.household} members={this.state.members} updatedFunction={this.handleUpdate} />
    }
}

export default Household;