import React from 'react';
import { PersonHelper, AssociatedForms, PersonInterface } from './'
import { Row, Col } from 'react-bootstrap';

interface Props {
    id?: string,
    person: PersonInterface
    editFunction: (e: React.MouseEvent) => void,
    addFormId: number,
    photoUrl: string
    setAddFormFunction: (formId: number) => void
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
        if (p.contactInfo.email !== undefined && p.contactInfo.email !== '') {
            contactMethods.push(<tr key="email"><td><label>{homeLabel}</label></td><td><i className="far fa-envelope"></i></td><td><a href={"mailto:" + p.contactInfo.email}>{p.contactInfo.email}</a></td></tr>);
            homeLabel = '';
        }
        if (p.contactInfo.homePhone !== undefined && p.contactInfo.homePhone !== '') {
            contactMethods.push(<tr key="homePhone"><td><label>{homeLabel}</label></td><td><i className="fas fa-phone"></i></td><td>{p.contactInfo.homePhone}</td></tr>);
            homeLabel = '';
        }

        if (p.contactInfo.address1 !== undefined && p.contactInfo.address1 !== '') {
            var lines = [];
            lines.push(<div>{p.contactInfo.address1}</div>);
            if (p.contactInfo.address2 !== '') lines.push(<div>{p.contactInfo.address2}</div>);
            lines.push(<div>{p.contactInfo.city}, {p.contactInfo.state} {p.contactInfo.zip}</div>);

            contactMethods.push(<tr key="address"><td><label>{homeLabel}</label></td><td><i className="fas fa-map-marker-alt"></i></td><td>{lines}</td></tr>);
        }
        if (p.contactInfo.mobilePhone !== undefined && p.contactInfo.mobilePhone !== '') contactMethods.push(<tr key="mobilePHone"><td><label>Mobile</label></td><td><i className="fas fa-phone"></i></td><td>{p.contactInfo.mobilePhone}</td></tr>);
        if (p.contactInfo.workPhone !== undefined && p.contactInfo.workPhone !== '') contactMethods.push(<tr key="workPhone"><td><label>Mobile</label></td><td><i className="fas fa-phone"></i></td><td>{p.contactInfo.workPhone}</td></tr>);
    }

    return (
        <div id={props.id} className="inputBox">
            <div className="header">
                <Row>
                    <Col xs={8}><i className="fas fa-user"></i> Personal Details</Col>
                    <Col xs={4} style={{ textAlign: 'right' }} ><a className="fa-pull-right" onClick={props.editFunction} href="about:blank"><i className="fas fa-pencil-alt"></i></a></Col>
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xs={3}>{getPhoto()}</Col>
                    <Col xs={9}>
                        <h2>{props.person?.name.display}</h2>
                        <Row>
                            <Col lg={6}>{leftAttributes}</Col>
                            <Col lg={6}><table className="contactTable"><tbody>{contactMethods}</tbody></table></Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <AssociatedForms contentType="person" contentId={props.person?.id} formSubmissions={props.person?.formSubmissions} addFormId={props.addFormId} setAddFormFunction={props.setAddFormFunction} />
        </div>
    )
}