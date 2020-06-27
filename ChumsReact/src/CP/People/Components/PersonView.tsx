import React from 'react';
import { PersonHelper, AssociatedForms, PersonInterface } from './'

interface Props {
    person: PersonInterface
    editFunction: (e: React.MouseEvent) => void,
    addFormId: number,
    photoUrl: string
}

export const PersonView: React.FC<Props> = (props) => {

    const getPhoto = () => {
        if (props.person) {
            var url = (props.photoUrl === null) ? PersonHelper.getPhotoUrl(props.person) : props.photoUrl;
            return <img src={url} className="img-fluid profilePic" id="imgPreview" alt="avatar" />
        } else return;
    }


    var leftAttributes = [];
    var contactMethods = [];
    if (props.person) {
        var p = props.person;
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
        <div className="inputBox">
            <div className="header"><a className="fa-pull-right" onClick={props.editFunction} href="about:blank"><i className="fas fa-pencil-alt"></i></a> <i className="fas fa-user"></i> Personal Details</div>
            <div className="content">
                <div className="row">
                    <div className="col-3">{getPhoto()}</div>
                    <div className="col-9">
                        <h2>{props.person?.displayName}</h2>
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
            </div>
            <AssociatedForms contentType="person" contentId={props.person?.id} formSubmissions={props.person?.formSubmissions} addFormId={props.addFormId} />
        </div>
    )
}