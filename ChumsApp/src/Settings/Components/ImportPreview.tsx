import React from 'react';
import { Table, Tabs, Tab, Alert } from 'react-bootstrap';
import { DisplayBox, ImportHelper } from '.';
import { ImportGroupInterface, ImportGroupMemberInterface, ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface, ImportGroupServiceTimeInterface, ImportPersonInterface, ImportHouseholdInterface, ImportHouseholdMemberInterface } from '../../Utils/ImportHelper';

interface Props {
    people: ImportPersonInterface[],
    households: ImportHouseholdInterface[],
    householdMembers: ImportHouseholdMemberInterface[],
    campuses: ImportCampusInterface[],
    services: ImportServiceInterface[],
    serviceTimes: ImportServiceTimeInterface[],
    groupServiceTimes: ImportGroupServiceTimeInterface[],
    groups: ImportGroupInterface[],
    groupMembers: ImportGroupMemberInterface[],
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

    const getMemberCount = (groupKey: string) => {
        var count = ImportHelper.getGroupMembers(props.groupMembers, groupKey).length;
        return (count === 1) ? '1 member' : count.toString() + ' members';
    }

    const getGroupsTable = () => {
        if (props.groups.length === 0) return null;
        else {
            var rows = [];
            for (var i = 0; i < props.campuses.length; i++) {
                var campus = props.campuses[i];
                var filteredServices = ImportHelper.getServices(props.services, campus.importKey);
                for (var j = 0; j < filteredServices.length; j++) {
                    var service = filteredServices[j];
                    var filteredTimes = ImportHelper.getServiceTimes(props.serviceTimes, service.importKey);
                    for (var k = 0; k < filteredTimes.length; k++) {
                        var time = filteredTimes[k];
                        var filteredGroupServiceTimes = ImportHelper.getGroupServiceTimes(props.groupServiceTimes, time.importKey);
                        for (var l = 0; l < filteredGroupServiceTimes.length; l++) {
                            var group = ImportHelper.getGroupByKey(props.groups, props.groupServiceTimes[l].groupKey);
                            rows.push(<tr><td>{props.campuses[i].name}</td><td>{props.services[j].name}</td><td>{props.serviceTimes[k].name}</td><td>{group.categoryName}</td><td>{group.name}</td><td>{getMemberCount(group.importKey)}</td></tr>);
                        }
                    }
                }
            }

            for (var i = 0; i < props.groups.length; i++) {
                var groupServiceTimes = ImportHelper.getGroupServiceTimesByGroupKey(props.groupServiceTimes, props.groups[i].importKey);
                if (groupServiceTimes.length === 0) rows.push(<tr><td></td><td></td><td></td><td>{props.groups[i].categoryName}</td><td>{props.groups[i].name}</td><td>{getMemberCount(props.groups[i].importKey)}</td></tr>);
            }

            return (<Table size="sm">
                <thead><tr><th>Campus</th><th>Service</th><th>Time</th><th>Category</th><th>Group</th><th>Members</th></tr></thead>
                <tbody>{rows}</tbody>
            </Table >);
        }
        return <></>;
    }


    if (props.people.length === 0) return (<Alert variant="info"><b>Important:</b> This tool is designed to help you load your initial data into the system.  Using it after you have been using Chums for a while is risky and may result in duplicated data.</Alert>);
    else return (<>
        <h2>Preview</h2>
        <Tabs defaultActiveKey="people" id="previewTabs" >
            <Tab eventKey="people" title="People"><DisplayBox headerIcon="" headerText="People">{getPeopleTable()}</DisplayBox></Tab>
            <Tab eventKey="groups" title="Groups"><DisplayBox headerIcon="" headerText="Groups">{getGroupsTable()}</DisplayBox></Tab>
        </Tabs>
    </>);
}

