import React from 'react';
import UserContext from '../../../UserContext'
import PersonHelper from '../../../Utils/PersonHelper'
import DisplayBox from '../../Components/DisplayBox'

class PersonView extends React.Component {
    static contextType = UserContext

    getPhoto() {
        if (this.props.person) {
            var url = PersonHelper.getPhotoUrl(1, this.props.person.id, this.props.person.photoUpdated)
            return <img src={url} className="img-fluid profilePic" id="imgPreview" alt="avatar" />
        } else return;
    }
    /*
        handleEdit(e) {
            e.preventDefault();
            alert('Edit');
        }
    */
    render() {

        var leftAttributes = [];
        var contactMethods = [];
        if (this.props.person) {
            var p = this.props.person;
            if (p.gender !== undefined) leftAttributes.push(<div key="gender"><label>Gender:</label> {p.gender}</div>);
            if (p.birthDate !== undefined) leftAttributes.push(<div key="age"><label>Age:</label> {PersonHelper.getAge(p.birthDate)}</div>);
            if (p.maritalStatus !== undefined) {
                if (p.anniversary !== undefined) leftAttributes.push(<div key="maritalStatus"><label>Marital Status:</label> {p.maritalStatus} ({new Date(p.anniversary).toLocaleDateString()})</div>);
                else leftAttributes.push(<div key="maritalStatus"><label>Marital Status:</label> {p.maritalStatus}</div>);
            }
            if (p.membershipStatus !== undefined) leftAttributes.push(<div key="membership"><label>Membership:</label> {p.membershipStatus}</div>);

            var homeLabel = 'Home';
            if (p.email !== undefined && p.email !== '') {
                contactMethods.push(<tr key="email"><td><label>{homeLabel}</label></td><td><i className="far fa-envelope"></i></td><td><a href={"mailto:" + p.email}>{p.email}</a></td></tr>);
                homeLabel = '';
            }
            if (p.homePhone !== undefined && p.homePhone !== '') {
                contactMethods.push(<tr key="homePhone"><td><label>{homeLabel}</label></td><td><i className="fas fa-phone"></i></td><td>{p.homePhone}</td></tr>);
                homeLabel = '';
            }
            if (p.address1 !== undefined && p.address1 !== '') contactMethods.push(<tr key="address"><td><label>{homeLabel}</label></td><td><i className="fas fa-map-marker-alt"></i></td><td>{p.address1}<br />{p.address2}<br />{p.city}, {p.state} {p.zip}</td></tr>);
            if (p.mobilePhone !== undefined && p.mobilePhone !== '') contactMethods.push(<tr key="mobilePHone"><td><label>Mobile</label></td><td><i className="fas fa-phone"></i></td><td>{p.mobilePhone}</td></tr>);
            if (p.workPhone !== undefined && p.workPhone !== '') contactMethods.push(<tr key="workPhone"><td><label>Mobile</label></td><td><i className="fas fa-phone"></i></td><td>{p.workPhone}</td></tr>);
        }

        return (

            <DisplayBox headerIcon="fas fa-user" headerText="Personal Details" editFunction={this.props.editFunction}>
                <div className="row">
                    <div className="col-3">{this.getPhoto()}</div>
                    <div className="col-9">
                        <h2>{this.props.person?.displayName}</h2>
                        <div className="row">
                            <div className="col-6">
                                {leftAttributes}
                            </div>
                            <div className="col-6">
                                <table className="contactTable">
                                    <tbody>
                                        {contactMethods}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </DisplayBox>

        )
    }
}

export default PersonView;