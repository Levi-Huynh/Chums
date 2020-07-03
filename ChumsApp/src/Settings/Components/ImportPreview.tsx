import React from 'react';
import { Col, Card, Table, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DisplayBox, UserHelper, PersonInterface, ApiHelper, HouseholdInterface, HouseholdMemberInterface, ImportHelper } from '.';

interface Props {
    people: PersonInterface[],
    households: HouseholdInterface[],
    householdMembers: HouseholdMemberInterface[],
    triggerRender: number
}

export const ImportPreview: React.FC<Props> = (props) => {

    const getPeopleTable = () => {
        if (props.households.length === 0) return null;
        else {
            if (props.triggerRender > -1) {                       //This line is just to trigger re-render when a photo is downloaded
                var rows = [];
                for (let i = 0; i < props.households.length; i++) {
                    rows.push(<tr><td colSpan={3}><i>{props.households[i].name} Household</i></td></tr>);
                    var members = ImportHelper.getHouseholdMembers(props.householdMembers, props.people, props.households[i].importKey);
                    for (let j = 0; j < members.length; j++) {
                        var p = members[j].person;
                        var imgTag = (p.photo === undefined) ? null : <img src={p.photo} className="personPhoto" />;
                        rows.push(<tr><td>{imgTag}</td><td>{p.firstName}</td><td>{p.lastName}</td></tr>);
                    }
                }
                return (<Table>
                    <thead><tr><th>Photo</th><th>First Name</th><th>Last Name</th></tr></thead>
                    <tbody>{rows}</tbody>
                </Table>);
            }
        }
        return null;
    }

    if (props.people.length === 0) return (<Alert variant="info"><b>Important:</b> This tool is designed to help you load your initial data into the system.  Using it after you have been using Chums for a while is risky and may result in duplicated data.</Alert>);
    else return (<>
        <h2>Preview</h2>
        <Tabs defaultActiveKey="people" id="previewTabs" >
            <Tab eventKey="people" title="People"><DisplayBox headerIcon="" headerText="People">{getPeopleTable()}</DisplayBox></Tab>
            <Tab eventKey="groups" title="Groups"><DisplayBox headerIcon="" headerText="Groups">Groups</DisplayBox></Tab>
        </Tabs>
    </>);
}

