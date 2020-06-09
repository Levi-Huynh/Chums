import React from 'react';
import InputBox from '../../Components/InputBox';
import PersonAdd from '../../Components/PersonAdd';
import PersonHelper from '../../../Utils/PersonHelper';
import ApiHelper from '../../../Utils/ApiHelper';

class HouseholdEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = { household: this.props.household, members: this.props.members, showAdd: false };

        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handlePersonAdd = this.handlePersonAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
    }

    componentDidMount() {
        //this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.members !== this.props.members) this.setState({ members: this.props.members });
        if (prevProps.household !== this.props.household) this.setState({ household: this.props.household });
    }

    handleChange(e) {
        e.preventDefault();
        var h = this.state.household;
        h.name = e.target.value;
        this.setState({ household: h });
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.updatedFunction();
    }

    handleSave(e) {
        e.preventDefault();

        var promises = [];
        promises.push(ApiHelper.apiPost('/households', [this.state.household]));
        promises.push(ApiHelper.apiPost('/householdmembers/' + this.state.household.id, this.state.members));
        Promise.all(promises).then(() => this.props.updatedFunction());
        this.props.updatedFunction();
    }

    handleAdd(e) {
        e.preventDefault();
        this.setState({ showAdd: true });
    }

    handlePersonAdd(person) {
        var member = { householdId: this.state.household.id, personId: person.id, person: person, role: 'Other' };
        var members = this.state.members;
        members.push(member);
        this.setState({ members: members });
    }

    handleRemove(e) {
        e.preventDefault();
        var m = this.state.members;
        var idx = e.target.parentNode.parentNode.getAttribute('data-index');
        m.splice(idx, 1);
        this.setState({ members: m });
    }

    handleChangeRole(e) {
        e.preventDefault();
        var m = this.state.members;
        var idx = e.target.parentNode.parentNode.getAttribute('data-index');
        m[idx].role = e.target.value;
        this.setState({ members: m });
    }

    render() {
        var rows = [];
        if (this.state.members !== null) {
            for (var i = 0; i < this.state.members.length; i++) {
                var m = this.state.members[i];
                rows.push(
                    <tr key={m.id} data-index={i} >
                        <td><img src={PersonHelper.getPhotoUrl(m.personId, m.person.photoUpdated)} alt="avatar" /></td>
                        <td>
                            {m.person.displayName}
                            <select value={m.role} onChange={this.handleChangeRole} className="form-control form-control-sm">
                                <option value="Head">Head</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Other">Other</option>
                            </select>
                        </td>
                        <td><a href="#" onClick={this.handleRemove} className="text-danger"><i className="fas fa-user-times"></i> Remove</a></td>
                    </tr>
                );
            }
        }


        var personAdd = (this.state.showAdd) ? <PersonAdd addFunction={this.handlePersonAdd} /> : null;

        return (
            <InputBox headerIcon="fas fa-users" headerText={(this.state.household?.name || '') + " Household"} saveFunction={this.handleSave} cancelFunction={this.handleCancel} >
                <div className="form-group">
                    <label>Household Name</label>
                    <input type="text" className="form-control" value={this.state.household?.name || ''} onChange={this.handleChange} />
                </div>
                <table className="table table-sm" id="householdMemberTable"><tbody>
                    {rows}
                    <tr>
                        <td></td>
                        <td></td>
                        <td><a href="#" className="text-success" onClick={this.handleAdd}> <i className="fas fa-user"></i> Add</a></td>
                    </tr>
                </tbody></table>
                {personAdd}

            </InputBox >
        );

    }
}

export default HouseholdEdit;
