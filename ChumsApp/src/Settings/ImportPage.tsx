import React from 'react';
import { UserHelper, PersonInterface, ApiHelper, ImportPreview, ImportHelper, InputBox, DisplayBox, UploadHelper } from './Components';
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

    const [importing, setImporting] = React.useState(false);
    const [status, setStatus] = React.useState<any>({});
    var progress: any = {};

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target) {
            let files = e.target.files;
            if (files.length > 0) runImports(files);
        }
    }

    const runImports = async (files: FileList) => {
        loadPeople(await UploadHelper.getCsv(files, 'people.csv'), files);
        var tmpServiceTimes = loadServiceTimes(await UploadHelper.getCsv(files, 'services.csv'));
        loadGroups(await UploadHelper.getCsv(files, 'groups.csv'));
        loadGroupMembers(await UploadHelper.getCsv(files, 'groupmembers.csv'));
        loadAttendance(await UploadHelper.getCsv(files, 'attendance.csv'), tmpServiceTimes);
        loadDonations(await UploadHelper.getCsv(files, 'donations.csv'));
    }

    const loadDonations = (data: any) => {
        var batches: ImportDonationBatchInterface[] = [];
        var funds: ImportFundInterface[] = [];
        var donations: ImportDonationInterface[] = [];
        var fundDonations: ImportFundDonationInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].amount !== undefined) {
            var d = data[i];
            var batch = ImportHelper.getOrCreateBatch(batches, d.batch, new Date(d.date));
            var fund = ImportHelper.getOrCreateFund(funds, d.fund);
            var donation = { importKey: (donations.length + 1).toString(), batchKey: batch.importKey, personKey: d.personKey, donationDate: new Date(d.date), amount: Number.parseFloat(d.amount), method: d.method, methodDetails: d.methodDetails, notes: d.notes } as ImportDonationInterface;
            var fundDonation = { donationKey: donation.importKey, fundKey: fund.importKey, amount: Number.parseFloat(d.amount) } as ImportFundDonationInterface;
            donations.push(donation);
            fundDonations.push(fundDonation);
        }

        setBatches(batches)
        setFunds(funds);
        setDonations(donations);
        setFundDonations(fundDonations);
    }

    const loadAttendance = (data: any, tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var sessions: ImportSessionInterface[] = [];
        var visits: ImportVisitInterface[] = [];
        var visitSessions: ImportVisitSessionInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined && data[i].groupKey !== undefined) {
            var session = ImportHelper.getOrCreateSession(sessions, new Date(data[i].date), data[i].groupKey, data[i].serviceTimeKey);
            var visit = ImportHelper.getOrCreateVisit(visits, data[i], tmpServiceTimes);
            var visitSession = { visitKey: visit.importKey, sessionKey: session.importKey } as ImportVisitSessionInterface;
            visitSessions.push(visitSession);

            var group = ImportHelper.getOrCreateGroup(groups, data[i]);
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
        return serviceTimes;
    }

    const loadGroups = (data: any) => {
        var groups: ImportGroupInterface[] = [];
        var groupServiceTimes: ImportGroupServiceTimeInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
            var group = ImportHelper.getOrCreateGroup(groups, data[i]);
            if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
                var gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
                groupServiceTimes.push(gst);
            }
        }
        setGroups(groups);
        setGroupServiceTimes(groupServiceTimes);
        return groups;
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
                if (p.photo !== undefined) UploadHelper.readImage(allFiles, p.photo).then((url: string) => { p.photo = url; setTriggerRender(Math.random()); });
                people.push(p);
            }
        }
        setPeople(people);
        setHouseholds(households);
        setHouseholdMembers(householdMembers);
        return people;
    }

    const assignHousehold = (households: ImportHouseholdInterface[], householdMembers: ImportHouseholdMemberInterface[], person: any) => {
        var householdName: string = person.householdName;
        if (households.length === 0 || households[households.length - 1].name !== householdName) households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
        householdMembers.push({ householdKey: households[households.length - 1].importKey, personKey: person.importKey } as ImportHouseholdMemberInterface);
    }

    const setProgress = (name: string, status: string) => {
        progress[name] = status;
        setStatus({ ...progress });
    }

    const getProgress = (name: string) => {
        if (status[name] === undefined) return (<li className="pending">{name}</li>);
        else return (<li className={status[name]}>{name}</li>);
    }

    const getAction = () => {
        if (importing) {
            var steps = ['Campuses', 'Services', 'Service Times', 'People', 'Households', 'Household Members', 'Groups', 'Group Service Times', 'Group Members', 'Group Sessions', 'Visits', 'Group Attendance', 'Funds', 'Donation Batches', 'Donations', 'Donation Funds'];
            var stepsHtml: JSX.Element[] = [];
            steps.forEach((s) => stepsHtml.push(getProgress(s)));
            return (
                <DisplayBox headerText="Import" headerIcon="fas fa-upload">
                    Importing content:
                    <ul className="statusList">{stepsHtml}</ul>
                    <p>This process may take some time.  It is important that you do not close your browser until it has finished.</p>
                </DisplayBox>
            );
        } else if (people.length === 0) return (
            <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Upload and Preview" saveFunction={() => { document.getElementById('fileUpload').click(); }} >
                Select a files to Upload.  You can download sample files <a href="/importsample.zip">here</a>.
                <input type="file" onChange={handleUpload} id="fileUpload" accept="*/*" multiple style={{ display: 'none' }} />
            </InputBox>
        );
        else return (
            <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Import" saveFunction={handleImport} >
                Previewing:
                <ul className="statusList">
                    <li>{people.length} people</li>
                    <li>{groups.length} groups</li>
                    <li>{visitSessions.length} attendance records</li>
                    <li>{fundDonations.length} donations</li>
                </ul>
                Please carefully review the preview data and if it looks good, click the Import button to start the import process.
            </InputBox>);
    }

    const runImport = async (keyName: string, code: () => void) => {
        setProgress(keyName, 'running');
        await code();
        setProgress(keyName, 'complete');
    }

    const importDonations = async (tmpPeople: ImportPersonInterface[]) => {
        var tmpFunds: ImportFundInterface[] = [...funds];
        var tmpBatches: ImportDonationBatchInterface[] = [...batches];
        var tmpDonations: ImportDonationInterface[] = [...donations];

        await runImport('Funds', async () => {
            var data = await ApiHelper.apiPost('/funds', tmpFunds);
            for (let i = 0; i < data.length; i++) tmpFunds[i].id = data[i];
        });

        await runImport('Donation Batches', async () => {
            var data = await ApiHelper.apiPost('/donationbatches', tmpBatches);
            for (let i = 0; i < data.length; i++) tmpBatches[i].id = data[i];
        });

        await runImport('Donations', async () => {
            tmpDonations.forEach((d) => {
                d.batchId = ImportHelper.getByImportKey(tmpBatches, d.batchKey).id;
                d.personId = ImportHelper.getByImportKey(tmpPeople, d.personKey)?.id;
            });
            var data = await ApiHelper.apiPost('/donations', tmpDonations);
            for (let i = 0; i < data.length; i++) tmpDonations[i].id = data[i];
        });

        await runImport('Donation Funds', async () => {
            var tmpFundDonations: ImportFundDonationInterface[] = [...fundDonations];
            tmpFundDonations.forEach((fd) => {
                fd.donationId = ImportHelper.getByImportKey(tmpDonations, fd.donationKey).id;
                fd.fundId = ImportHelper.getByImportKey(tmpFunds, fd.fundKey).id;
            });
            await ApiHelper.apiPost('/funddonations', tmpFundDonations);
        });
    }

    const importAttendance = async (tmpPeople: ImportPersonInterface[], tmpGroups: ImportGroupInterface[], tmpServices: ImportServiceInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var tmpSessions: ImportSessionInterface[] = [...sessions];
        var tmpVisits: ImportVisitInterface[] = [...visits];

        await runImport('Group Sessions', async () => {
            tmpSessions.forEach((s) => {
                s.groupId = ImportHelper.getByImportKey(tmpGroups, s.groupKey).id;
                s.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, s.serviceTimeKey).id;
            });
            var data = await ApiHelper.apiPost('/sessions', tmpSessions);
            for (let i = 0; i < data.length; i++) tmpSessions[i].id = data[i];
        });

        await runImport('Visits', async () => {
            tmpVisits.forEach((v) => {
                v.personId = ImportHelper.getByImportKey(tmpPeople, v.personKey).id;
                try {
                    v.serviceId = ImportHelper.getByImportKey(tmpServices, v.serviceKey).id;
                } catch {
                    v.groupId = ImportHelper.getByImportKey(tmpGroups, v.groupKey).id;
                }
            });
            var data = await ApiHelper.apiPost('/visits', tmpVisits);
            for (let i = 0; i < data.length; i++) tmpVisits[i].id = data[i];
        });

        await runImport('Group Attendance', async () => {
            var tmpVisitSessions: ImportVisitSessionInterface[] = [...visitSessions];
            tmpVisitSessions.forEach((vs) => {
                vs.visitId = ImportHelper.getByImportKey(tmpVisits, vs.visitKey).id;
                vs.sessionId = ImportHelper.getByImportKey(tmpSessions, vs.sessionKey).id;
            });
            await ApiHelper.apiPost('/visitsessions', tmpVisitSessions);
        });
    }

    const importGroups = async (tmpPeople: ImportPersonInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var tmpGroups: ImportGroupInterface[] = [...groups];
        var tmpTimes: ImportGroupServiceTimeInterface[] = [...groupServiceTimes];
        var tmpMembers: ImportGroupMemberInterface[] = [...groupMembers];

        await runImport('Groups', async () => {
            var data = await ApiHelper.apiPost('/groups', tmpGroups);
            for (let i = 0; i < data.length; i++) tmpGroups[i].id = data[i];
        });

        await runImport('Group Service Times', async () => {
            tmpTimes.forEach((gst) => {
                gst.groupId = ImportHelper.getByImportKey(tmpGroups, gst.groupKey).id
                gst.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, gst.serviceTimeKey).id
            });
            await ApiHelper.apiPost('/groupservicetimes', tmpTimes);
        });

        await runImport('Group Members', async () => {
            tmpMembers.forEach((gm) => {
                gm.groupId = ImportHelper.getByImportKey(tmpGroups, gm.groupKey).id
                gm.personId = ImportHelper.getByImportKey(tmpPeople, gm.personKey).id
            });
            await ApiHelper.apiPost('/groupmembers', tmpMembers);
        });

        return tmpGroups;
    }

    const importCampuses = async () => {
        var tmpCampuses: ImportCampusInterface[] = [...campuses];
        var tmpServices: ImportServiceInterface[] = [...services];
        var tmpServiceTimes: ImportServiceTimeInterface[] = [...serviceTimes];

        await runImport('Campuses', async () => {
            var data = await ApiHelper.apiPost('/campuses', tmpCampuses);
            for (let i = 0; i < data.length; i++) tmpCampuses[i].id = data[i];
        });

        await runImport('Services', async () => {
            tmpServices.forEach((s) => { s.campusId = ImportHelper.getByImportKey(tmpCampuses, s.campusKey).id });
            var data = await ApiHelper.apiPost('/services', tmpServices);
            for (let i = 0; i < data.length; i++) tmpServices[i].id = data[i];
        });

        await runImport('Service Times', async () => {
            tmpServiceTimes.forEach((st) => { st.serviceId = ImportHelper.getByImportKey(tmpServices, st.serviceKey).id });
            var data = await ApiHelper.apiPost('/servicetimes', tmpServiceTimes);
            for (let i = 0; i < data.length; i++) tmpServiceTimes[i].id = data[i];
        });

        return { campuses: tmpCampuses, services: tmpServices, serviceTimes: tmpServiceTimes };
    }

    const importPeople = async () => {
        var tmpPeople: ImportPersonInterface[] = [...people];
        var tmpHouseholds: ImportHouseholdInterface[] = [...households];
        var tmpHouseholdMembers: ImportHouseholdMemberInterface[] = [];

        tmpPeople.forEach((p) => {
            if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate);
        });

        await runImport('People', async () => {
            var data = await ApiHelper.apiPost('/people', tmpPeople);
            for (let i = 0; i < data.length; i++) tmpPeople[i].id = data[i];
        });

        await runImport('Households', async () => {
            var data = await ApiHelper.apiPost('/households', tmpHouseholds);
            for (let i = 0; i < data.length; i++) tmpHouseholds[i].id = data[i];
        });

        await runImport('Household Members', async () => {
            householdMembers.forEach((hm) => {
                try {
                    hm.personId = ImportHelper.getByImportKey(tmpPeople, hm.personKey).id;
                    hm.householdId = ImportHelper.getByImportKey(tmpHouseholds, hm.householdKey).id;
                    hm.role = 'Other';
                    tmpHouseholdMembers.push(hm);
                } catch { }
            });
            var promises: Promise<any>[] = [];
            tmpHouseholds.forEach((h) => {
                var hm = ImportHelper.getHouseholdMembers(tmpHouseholdMembers, h.importKey, null);
                promises.push(ApiHelper.apiPost('/householdmembers/' + h.id, hm));
            });
            await Promise.all(promises);
        });

        return tmpPeople;
    }

    const handleImport = async () => {
        if (window.confirm('Are you sure you wish to load the list of people below into your database?')) {
            setImporting(true);
            var campusResult = await importCampuses();
            var tmpPeople = await importPeople();
            var tmpGroups = await importGroups(tmpPeople, campusResult.serviceTimes);
            await importAttendance(tmpPeople, tmpGroups, campusResult.services, campusResult.serviceTimes);
            await importDonations(tmpPeople);
        }
    }


    //const importDone = () => { setPeople([]) }


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

