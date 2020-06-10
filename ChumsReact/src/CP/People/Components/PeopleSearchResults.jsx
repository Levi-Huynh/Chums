import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PersonHelper from '../../../Utils/PersonHelper';
import ErrorMessages from "../../Components/ErrorMessages";
import ApiHelper from '../../../Utils/ApiHelper';
import { Redirect } from 'react-router-dom';

class PeopleSearchResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = { errors: [], firstName: '', lastName: '', redirectUrl: '' };
        this.handleAdd = this.handleAdd.bind(this);
        //this.handleChange = this.handleChange.bind(this); //*** Why is this not needed?
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    handleAdd(e) {
        e.preventDefault();
        var errors = [];
        if (this.state.firstName.trim() === '') errors.push('First name cannot be blank.');
        if (this.state.lastName.trim() === '') errors.push('Last name cannot be blank.');
        this.setState({ errors: errors });

        ApiHelper.apiGet('/campuses').then(data => {
            var campusId = data[0].id;
            var person = { firstName: this.state.firstName, lastName: this.state.lastName, campuseId: campusId };
            var household = { name: this.state.lastName };
            var promises = [];
            promises.push(ApiHelper.apiPost('/people', [person]).then(data => person.id = data[0]));
            promises.push(ApiHelper.apiPost('/households', [household]).then(data => household.id = data[0]));
            Promise.all(promises).then(() => {
                var householdMember = { householdId: household.id, personId: person.id, role: 'Head' };
                ApiHelper.apiPost('/householdmembers/' + household.id, [householdMember]).then(this.setState({ redirectUrl: '/cp/people/' + person.id }));
            });
        });
    }

    render() {

        if (this.state.redirectUrl !== '') return <Redirect to={this.state.redirectUrl}></Redirect>;
        else if (this.props.people === undefined || this.props.people == null || this.props.people.length === 0) return <Fragment></Fragment>
        else {
            const items = [];
            for (var i = 0; i < this.props.people.length; i++) {
                var p = this.props.people[i];
                items.push(<tr key={p.id}>
                    <td><img src={PersonHelper.getPhotoUrl(1, p.id, p.photoUpdated)} alt="avatar" /></td>
                    <td><Link to={"/cp/people/" + p.id.toString()}>{p.displayName}</Link></td>
                </tr>);
            }
            var result =
                <Fragment>
                    <table className="table" id="peopleTable">
                        <tbody>
                            <tr><th></th><th>Name</th></tr>
                            {items}
                        </tbody>
                    </table>
                    <hr />
                    <ErrorMessages errors={this.state.errors} />
                    <b>Add a New Person</b>
                    <div className="row">
                        <div className="col"><input type="text" className="form-control" placeholder="First Name" name="firstName" value={this.state.firstName} onChange={this.handleChange} /></div>
                        <div className="col"><input type="text" className="form-control" placeholder="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleChange} /></div>
                        <div className="col"><input type="submit" className="btn btn-primary" value="Add" onClick={this.handleAdd} /></div>
                    </div>
                </Fragment>;
            return result;
        }
    }
}
export default PeopleSearchResults;