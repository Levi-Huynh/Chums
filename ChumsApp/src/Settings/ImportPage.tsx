import React from 'react';
import { UserHelper, PersonInterface, ApiHelper, HouseholdInterface, ImportPreview, ImportHelper, InputBox } from './Components';
import {
    ImportHouseholdMemberInterface, ImportPersonInterface, ImportHouseholdInterface
    , ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface
    , ImportGroupInterface, ImportGroupMemberInterface, ImportGroupServiceTimeInterface
    , ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface
    , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface, ImportFundDonationInterface
} from '../Utils/ImportHelper';
import { Row, Col } from 'react-bootstrap';

export const ImportPage = () => {
    const [people, setPeople] = React.useState<ImportPersonInterface[]>([]);
    const [households, setHouseholds] = React.useState<ImportHouseholdInterface[]>([]);
    const [householdMembers, setHouseholdMembers] = React.useState<ImportHouseholdMemberInterface[]>([]);
    const [triggerRender, setTriggerRender] = React.useState(0);

    const [campuses, setCampuses] = React.useState<ImportCampusInterface[]>([]);
    const [services, setServices] = React.useState<ImportServiceInterface[]>([]);
    const [serviceTimes, setServiceTimes] = React.useState<ImportServiceTimeInterface[]>([]);

    const [groupServiceTimes, setGroupServiceTimes] = React.useState<ImportGroupServiceTimeInterface[]>([]);
    const [groups, setGroups] = React.useState<ImportGroupInterface[]>([]);
    const [groupMembers, setGroupMembers] = React.useState<ImportGroupMemberInterface[]>([]);

    const [sessions, setSessions] = React.useState<ImportSessionInterface[]>([])
    const [visits, setVisits] = React.useState<ImportVisitInterface[]>([])
    const [visitSessions, setVisitSessions] = React.useState<ImportVisitSessionInterface[]>([])

    const [batches, setBatches] = React.useState<ImportDonationBatchInterface[]>([]);
    const [funds, setFunds] = React.useState<ImportFundInterface[]>([]);
    const [donations, setDonations] = React.useState<ImportDonationInterface[]>([]);
    const [fundDonations, setFundDonations] = React.useState<ImportFundDonationInterface[]>([]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target) {
            let files = e.target.files;
            if (files.length > 0) {
                ImportHelper.getCsv(files, 'people.csv', (data: any) => { loadPeople(data, files) });
                ImportHelper.getCsv(files, 'services.csv', loadServiceTimes);
                ImportHelper.getCsv(files, 'groups.csv', loadGroups);
                ImportHelper.getCsv(files, 'groupmembers.csv', loadGroupMembers);
                ImportHelper.getCsv(files, 'attendance.csv', loadAttendance);
                ImportHelper.getCsv(files, 'donations.csv', loadDonations);
            }
        }
    }

    const loadDonations = (data: any) => {
        var batches: ImportDonationBatchInterface[] = [];
        var funds: ImportFundInterface[] = [];
        var donations: ImportDonationInterface[] = [];
        var fundDonations: ImportFundDonationInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].amount !== undefined) {
            var d = data[i];
            var batch = ImportHelper.getOrCreateBatch(batches, d.batch, d.date);
            var fund = ImportHelper.getOrCreateFund(funds, d.fund);
            var donation = { importKey: (donations.length + 1).toString(), batchKey: batch.importKey, personKey: d.personKey, donationDate: d.date, amount: d.amount, method: d.method, methodDetails: d.methodDetails, notes: d.notes } as ImportDonationInterface;
            var fundDonation = { donationKey: donation.importKey, fundKey: fund.importKey, amount: d.amount } as ImportFundDonationInterface;
            donations.push(donation);
            fundDonations.push(fundDonation);
        }

        setBatches(batches)
        setFunds(funds);
        setDonations(donations);
        setFundDonations(fundDonations);
    }

    const loadAttendance = (data: any) => {
        var sessions: ImportSessionInterface[] = [];
        var visits: ImportVisitInterface[] = [];
        var visitSessions: ImportVisitSessionInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined && data[i].groupKey !== undefined) {
            var session = ImportHelper.getOrCreateSession(sessions, data[i].date, data[i].groupKey, data[i].serviceTimeKey);
            var visit = ImportHelper.getOrCreateVisit(visits, data[i], serviceTimes);
            var visitSession = { visitKey: visit.importKey, sessionKey: session.importKey } as ImportVisitSessionInterface;
            visitSessions.push(visitSession);

            var group = ImportHelper.getGroup(groups, data[i]);
            if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
                var gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
                groupServiceTimes.push(gst);
            }
        }
        setVisits(visits);
        setSessions(sessions);
        setVisitSessions(visitSessions);
    }


    const loadServiceTimes = (data: any) => {
        var campuses: ImportCampusInterface[] = [];
        var services: ImportServiceInterface[] = [];
        var serviceTimes: ImportServiceTimeInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].time !== undefined) {
            var campus = ImportHelper.getOrCreateCampus(campuses, data[i].campus);
            var service = ImportHelper.getOrCreateService(services, data[i].service, campus);
            ImportHelper.getOrCreateServiceTime(serviceTimes, data[i], service);
        }
        setCampuses(campuses);
        setServices(services);
        setServiceTimes(serviceTimes);
    }

    const loadGroups = (data: any) => {
        var groups: ImportGroupInterface[] = [];
        var groupServiceTimes: ImportGroupServiceTimeInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
            var group = ImportHelper.getGroup(groups, data[i]);
            if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
                var gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
                groupServiceTimes.push(gst);
            }
        }
        setGroups(groups);
        setGroupServiceTimes(groupServiceTimes);
    }

    const loadGroupMembers = (data: any) => {
        var members: ImportGroupMemberInterface[] = [];
        for (let i = 0; i < data.length; i++) if (data[i].groupKey !== undefined) members.push(data[i] as ImportGroupMemberInterface);
        setGroupMembers(members);
    }

    const loadPeople = (data: any, allFiles: FileList) => {
        var people: ImportPersonInterface[] = [];
        var households: ImportHouseholdInterface[] = [];
        var householdMembers: ImportHouseholdMemberInterface[] = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].lastName !== undefined) {
                var p = data[i] as ImportPersonInterface;
                assignHousehold(households, householdMembers, data[i]);
                if (p.photo !== undefined) ImportHelper.readImage(allFiles, p, () => { setTriggerRender(Math.random()); });
                people.push(p);
            }
        }
        setPeople(people);
        setHouseholds(households);
        setHouseholdMembers(householdMembers);
    }

    const assignHousehold = (households: ImportHouseholdInterface[], householdMembers: ImportHouseholdMemberInterface[], person: any) => {
        var householdName: string = person.householdName;
        if (households.length === 0 || households[households.length - 1].name !== householdName) households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
        householdMembers.push({ householdKey: households[households.length - 1].importKey, personKey: person.importKey } as ImportHouseholdMemberInterface);
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
                        groupMembers={groupMembers}
                        visits={visits}
                        sessions={sessions}
                        visitSessions={visitSessions}
                        batches={batches}
                        donations={donations}
                        funds={funds}
                        fundDonations={fundDonations}
                    />
                </Col>
                <Col lg={4}>
                    {getAction()}
                </Col>
            </Row>
        </>
    );
}

