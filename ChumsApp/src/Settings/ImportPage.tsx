import React from 'react';
import { DisplayBox, UserHelper, PersonInterface, ApiHelper, HouseholdInterface, HouseholdMemberInterface, GroupInterface, GroupMemberInterface, ImportPreview, ImportHelper, InputBox, CampusInterface, ServiceInterface, GroupServiceTimeInterface, ServiceTimeInterface } from './Components';
import { Row, Col, Button } from 'react-bootstrap';



export const ImportPage = () => {
    const [people, setPeople] = React.useState<PersonInterface[]>([]);
    const [households, setHouseholds] = React.useState<HouseholdInterface[]>([]);
    const [householdMembers, setHouseholdMembers] = React.useState<HouseholdMemberInterface[]>([]);

    const [campuses, setCampuses] = React.useState<CampusInterface[]>([]);
    const [services, setServices] = React.useState<ServiceInterface[]>([]);
    const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>([]);
    const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);
    const [groups, setGroups] = React.useState<GroupInterface[]>([]);
    const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);
    const [triggerRender, setTriggerRender] = React.useState(0);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target) {
            let files = e.target.files;
            if (files.length > 0) {
                ImportHelper.getCsv(files, 'people.csv', (data: any) => { loadPeople(data, files) });
                ImportHelper.getCsv(files, 'groups.csv', loadGroups);
                ImportHelper.getCsv(files, 'groupmembers.csv', loadGroupMembers);
            }
        }
    }

    const loadGroups = (data: any) => {
        var groups: GroupInterface[] = [];
        var campuses: CampusInterface[] = [];
        var services: ServiceInterface[] = [];
        var serviceTimes: ServiceTimeInterface[] = [];
        var groupServiceTimes: GroupServiceTimeInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
            var campus = ImportHelper.getCampus(campuses, data[i].campus);
            var service = ImportHelper.getService(services, data[i].service, campus);
            var serviceTime = ImportHelper.getServiceTime(serviceTimes, data[i].time, service);
            var group = ImportHelper.getGroup(groups, data[i]);
            if (group !== null && serviceTime !== null) {
                var gst = { groupKey: group.importKey, serviceTimeKey: serviceTime.importKey } as GroupServiceTimeInterface;
                groupServiceTimes.push(gst);
            }
        }
        setCampuses(campuses);
        setServices(services);
        setServiceTimes(serviceTimes);
        setGroups(groups);
        setGroupServiceTimes(groupServiceTimes);
    }



    const loadGroupMembers = (data: any) => {
        var members: GroupMemberInterface[] = [];
        for (let i = 0; i < data.length; i++) if (data[i].groupKey !== undefined) members.push(data[i] as GroupMemberInterface);
        setGroupMembers(members);
    }

    const loadPeople = (data: any, allFiles: FileList) => {
        var people: PersonInterface[] = [];
        var households: HouseholdInterface[] = [];
        var householdMembers: HouseholdMemberInterface[] = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].lastName !== undefined) {
                var p = data[i] as PersonInterface;
                assignHousehold(households, householdMembers, data[i]);
                if (p.photo !== undefined) ImportHelper.readImage(allFiles, p, () => { setTriggerRender(Math.random()); });
                people.push(p);
            }
        }
        setPeople(people);
        setHouseholds(households);
        setHouseholdMembers(householdMembers);
    }

    const assignHousehold = (households: HouseholdInterface[], householdMembers: HouseholdMemberInterface[], person: any) => {
        var householdName: string = person.householdName;
        if (households.length === 0 || households[households.length - 1].name !== householdName) households.push({ name: householdName, importKey: (households.length + 1).toString() } as HouseholdInterface);
        householdMembers.push({ householdKey: households[households.length - 1].importKey, personKey: person.importKey } as HouseholdMemberInterface);
    }

    const getAction = () => {
        if (people.length === 0) return (
            <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Upload and Preview" saveFunction={() => { document.getElementById('fileUpload').click(); }} >
                Select a Files to Upload
                <input type="file" onChange={handleUpload} id="fileUpload" accept="*/*" multiple style={{ display: 'none' }} />
            </InputBox>
        );
        else return (
            <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Import" saveFunction={handleImport} >
                Please carefully review the preview data and if it looks good, click the Import button to start the import process.
            </InputBox>);
    }

    const handleImport = () => {
        if (window.confirm('Are you sure you wish to load the list of people below into your database?')) {
            var tmpPeople: PersonInterface[] = [...people];
            tmpPeople.forEach((p) => { if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate); });
            ApiHelper.apiPost('/people', tmpPeople).then(data => {
                importDone();
            });
        }
    }


    const importDone = () => { setPeople([]) }


    if (!UserHelper.checkAccess('Admin', 'Import')) return (<></>);
    return (
        <>
            <h1><i className="fas fa-upload"></i> Import Data</h1>

            <Row>
                <Col lg={8}>
                    <ImportPreview
                        people={people}
                        households={households}
                        householdMembers={householdMembers}
                        triggerRender={triggerRender}
                        campuses={campuses}
                        services={services}
                        serviceTimes={serviceTimes}
                        groupServiceTimes={groupServiceTimes}
                        groups={groups}
                        groupMembers={groupMembers} />
                </Col>
                <Col lg={4}>
                    {getAction()}
                </Col>
            </Row>
        </>
    );
}

