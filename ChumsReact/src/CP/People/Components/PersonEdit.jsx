import React from 'react';
import UserContext from '../../../UserContext'
import PersonHelper from '../../../Utils/PersonHelper'
import Helper from '../../../Utils/Helper'
import StateOptions from '../../Components/StateOptions';
import InputBox from '../../Components/InputBox';
import ApiHelper from '../../../Utils/ApiHelper';
import { Redirect } from 'react-router-dom';
import AddForm from './AddForm';



class PersonEdit extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = { person: this.props.person, redirect: null, errors: [] };
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    getPhoto() {
        if (this.props.person) {
            var url = PersonHelper.getPhotoUrl(1, this.props.person.id, this.props.person.photoUpdated)
            return <img src={url} className="img-fluid profilePic" id="imgPreview" alt="avatar" />
        } else return;
    }


    componentDidUpdate(prevProps) {
        if (prevProps.person !== this.props.person) {
            this.setState({ person: this.props.person })
        }
    }

    handleChange = e => {
        var p = this.state.person;
        p[e.target.name] = e.target.value;
        this.setState({ person: p });
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.updatedFunction(null);
        //alert('Cancel');
    }

    handleDelete(e) {
        e.preventDefault();
        if (window.confirm('Are you sure you wish to permanently delete this person record?')) {
            ApiHelper.apiDelete('/people/' + this.state.person.id.toString()).then(data => {
                this.setState({ redirect: '/cp/people/' });
            });
        }
    }

    handleSave(e) {
        e.preventDefault();

        const p = this.state.person;
        ApiHelper.apiPost('/people/', [p])
            .then(data => {
                p.id = data[0];
                p.displayName = PersonHelper.getDisplayName(p.firstName, p.lastName, p.nickname)
                this.setState({ person: p });;
                this.props.updatedFunction(p);
            });
    }



    render() {
        if (this.state.redirect !== null) return <Redirect to={this.state.redirect} />
        else {
            return (
                <InputBox headerIcon="fas fa-user" headerText="Personal Details" cancelFunction={this.handleCancel} deleteFunction={this.handleDelete} saveFunction={this.handleSave} >
                    <div className="row">
                        <div className="col-3">{this.getPhoto()}</div>
                        <div className="col-9">

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" name="firstName" value={this.state.person?.firstName || ''} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Middle Name</label>
                                        <input type="text" name="middleName" value={this.state.person?.middleName || ''} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="lastName" value={this.state.person?.lastName || ''} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Nickname</label>
                                        <input type="text" name="nickname" value={this.state.person?.nickname || ''} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Membership Status</label>
                                        <select name="membershipStatus" value={this.state.person?.membershipStatus || ''} onChange={this.handleChange} className="form-control">
                                            <option value="Visitor">Visitor</option>
                                            <option value="Member">Member</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select name="gender" value={this.state.person?.gender || ''} onChange={this.handleChange} className="form-control">
                                            <option value="Unspecified">Unspecified</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Birthdate</label>
                                        <input type="date" name="birthDate" value={Helper.formatHtml5Date(this.state.person?.birthDate)} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Marital Status</label>
                                        <select name="maritalStatus" value={this.state.person?.maritalStatus || ''} onChange={this.handleChange} className="form-control">
                                            <option value="Unknown">Visitor</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Anniversary</label>
                                        <input type="date" name="anniversary" value={Helper.formatHtml5Date(this.state.person?.anniversary)} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="row">
                        <div className="col-6">
                            <div className="section">Address</div>
                            <div className="form-group">
                                <label>Line 1</label>
                                <input type="text" name="address1" value={this.state.person?.address1 || ''} onChange={this.handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Line 2</label>
                                <input type="text" name="address2" value={this.state.person?.address2 || ''} onChange={this.handleChange} className="form-control" />
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" name="city" value={this.state.person?.city || ''} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="form-group">
                                        <label>State</label>
                                        <select name="state" value={this.state.person?.state || ''} onChange={this.handleChange} className="form-control">
                                            <StateOptions />
                                        </select>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="form-group">
                                        <label>Zip</label>
                                        <input type="text" name="zip" value={this.state.person?.zip || ''} onChange={this.handleChange} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="section">Phone</div>
                            <div className="form-group">
                                <label>Home</label>
                                <input type="text" name="homePhone" value={this.state.person?.homePhone || ''} onChange={this.handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Work</label>
                                <input type="text" name="workPhone" value={this.state.person?.workPhone || ''} onChange={this.handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Mobile</label>
                                <input type="text" name="mobilePhone" value={this.state.person?.mobilePhone || ''} onChange={this.handleChange} className="form-control" />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="section">Email</div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" name="email" value={this.state.person?.email || ''} onChange={this.handleChange} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <AddForm person={this.state.person} addFormFunction={this.props.addFormFunction} />

                </InputBox>
            )
        }
    }
}

export default PersonEdit;

