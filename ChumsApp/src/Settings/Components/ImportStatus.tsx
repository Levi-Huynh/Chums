import React from 'react';
import { DisplayBox, ImportHelper, ApiHelper, InputBox } from '.';
import { ImportGroupInterface, ImportGroupMemberInterface, ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface, ImportGroupServiceTimeInterface, ImportPersonInterface, ImportHouseholdInterface, ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface, ImportDonationBatchInterface, ImportDonationInterface, ImportFundInterface, ImportFundDonationInterface, ImportDataInterface } from '../../Utils/ImportHelper';

interface Props { importData: ImportDataInterface }

export const ImportStatus: React.FC<Props> = (props) => {
    const [importing, setImporting] = React.useState(false);
    const [status, setStatus] = React.useState<any>({});
    var progress: any = {};

    const runImport = async (keyName: string, code: () => void) => {
        setProgress(keyName, 'running');
        await code();
        setProgress(keyName, 'complete');
    }

    const importDonations = async (tmpPeople: ImportPersonInterface[]) => {
        var tmpFunds: ImportFundInterface[] = [...props.importData.funds];
        var tmpBatches: ImportDonationBatchInterface[] = [...props.importData.batches];
        var tmpDonations: ImportDonationInterface[] = [...props.importData.donations];

        await runImport('Funds', async () => { tmpFunds = await ApiHelper.apiPost('/funds', tmpFunds); });

        await runImport('Donation Batches', async () => { tmpBatches = await ApiHelper.apiPost('/donationbatches', tmpBatches); });

        await runImport('Donations', async () => {
            tmpDonations.forEach((d) => {
                d.batchId = ImportHelper.getByImportKey(tmpBatches, d.batchKey).id;
                d.personId = ImportHelper.getByImportKey(tmpPeople, d.personKey)?.id;
            });
            tmpDonations = await ApiHelper.apiPost('/donations', tmpDonations);
        });

        await runImport('Donation Funds', async () => {
            var tmpFundDonations: ImportFundDonationInterface[] = [...props.importData.fundDonations];
            tmpFundDonations.forEach((fd) => {
                fd.donationId = ImportHelper.getByImportKey(tmpDonations, fd.donationKey).id;
                fd.fundId = ImportHelper.getByImportKey(tmpFunds, fd.fundKey).id;
            });
            tmpFundDonations = await ApiHelper.apiPost('/funddonations', tmpFundDonations);
        });
    }

    const importAttendance = async (tmpPeople: ImportPersonInterface[], tmpGroups: ImportGroupInterface[], tmpServices: ImportServiceInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var tmpSessions: ImportSessionInterface[] = [...props.importData.sessions];
        var tmpVisits: ImportVisitInterface[] = [...props.importData.visits];
        await runImport('Group Sessions', async () => {
            tmpSessions.forEach((s) => {
                s.groupId = ImportHelper.getByImportKey(tmpGroups, s.groupKey).id;
                s.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, s.serviceTimeKey).id;
            });
            tmpSessions = await ApiHelper.apiPost('/sessions', tmpSessions);
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
            tmpVisits = await ApiHelper.apiPost('/visits', tmpVisits);
        });

        await runImport('Group Attendance', async () => {
            var tmpVisitSessions: ImportVisitSessionInterface[] = [...props.importData.visitSessions];
            tmpVisitSessions.forEach((vs) => {
                vs.visitId = ImportHelper.getByImportKey(tmpVisits, vs.visitKey).id;
                vs.sessionId = ImportHelper.getByImportKey(tmpSessions, vs.sessionKey).id;
            });
            tmpVisitSessions = await ApiHelper.apiPost('/visitsessions', tmpVisitSessions);
        });
    }

    const importGroups = async (tmpPeople: ImportPersonInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var tmpGroups: ImportGroupInterface[] = [...props.importData.groups];
        var tmpTimes: ImportGroupServiceTimeInterface[] = [...props.importData.groupServiceTimes];
        var tmpMembers: ImportGroupMemberInterface[] = [...props.importData.groupMembers];

        await runImport('Groups', async () => { tmpGroups = await ApiHelper.apiPost('/groups', tmpGroups); });

        await runImport('Group Service Times', async () => {
            tmpTimes.forEach((gst) => {
                gst.groupId = ImportHelper.getByImportKey(tmpGroups, gst.groupKey).id
                gst.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, gst.serviceTimeKey).id
            });
            tmpTimes = await ApiHelper.apiPost('/groupservicetimes', tmpTimes);
        });

        console.log(tmpPeople);
        console.log(tmpGroups);

        await runImport('Group Members', async () => {
            tmpMembers.forEach((gm) => {
                gm.groupId = ImportHelper.getByImportKey(tmpGroups, gm.groupKey).id
                gm.personId = ImportHelper.getByImportKey(tmpPeople, gm.personKey).id
            });
            console.log(tmpMembers);
            tmpMembers = await ApiHelper.apiPost('/groupmembers', tmpMembers);
        });

        return tmpGroups;
    }

    const importCampuses = async () => {
        var tmpCampuses: ImportCampusInterface[] = [...props.importData.campuses];
        var tmpServices: ImportServiceInterface[] = [...props.importData.services];
        var tmpServiceTimes: ImportServiceTimeInterface[] = [...props.importData.serviceTimes];

        await runImport('Campuses', async () => {
            tmpCampuses = await ApiHelper.apiPost('/campuses', tmpCampuses);
        });

        await runImport('Services', async () => {
            tmpServices.forEach((s) => { s.campusId = ImportHelper.getByImportKey(tmpCampuses, s.campusKey).id });
            tmpServices = await ApiHelper.apiPost('/services', tmpServices);
        });

        await runImport('Service Times', async () => {
            tmpServiceTimes.forEach((st) => { st.serviceId = ImportHelper.getByImportKey(tmpServices, st.serviceKey).id });
            tmpServiceTimes = await ApiHelper.apiPost('/servicetimes', tmpServiceTimes);
        });

        return { campuses: tmpCampuses, services: tmpServices, serviceTimes: tmpServiceTimes };
    }

    const importPeople = async () => {
        var tmpPeople: ImportPersonInterface[] = [...props.importData.people];
        var tmpHouseholds: ImportHouseholdInterface[] = [...props.importData.households];

        tmpPeople.forEach((p) => {
            if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate);
        });

        await runImport('Households', async () => { tmpHouseholds = await ApiHelper.apiPost('/households', tmpHouseholds); });

        await runImport('People', async () => {

            tmpPeople.forEach((p) => {
                try {
                    p.householdId = ImportHelper.getByImportKey(tmpHouseholds, p.householdKey).id;
                    p.householdRole = 'Other';
                } catch { }
            });

            tmpPeople = await ApiHelper.apiPost('/people', tmpPeople);
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


    const setProgress = (name: string, status: string) => {
        progress[name] = status;
        setStatus({ ...progress });
    }

    const getProgress = (name: string) => {
        if (status[name] === undefined) return (<li className="pending">{name}</li>);
        else return (<li className={status[name]}>{name}</li>);
    }

    if (importing) {
        var steps = ['Campuses', 'Services', 'Service Times', 'Households', 'People', 'Groups', 'Group Service Times', 'Group Members', 'Group Sessions', 'Visits', 'Group Attendance', 'Funds', 'Donation Batches', 'Donations', 'Donation Funds'];
        var stepsHtml: JSX.Element[] = [];
        steps.forEach((s) => stepsHtml.push(getProgress(s)));
        return (
            <DisplayBox headerText="Import" headerIcon="fas fa-upload">
                Importing content:
                <ul className="statusList">{stepsHtml}</ul>
                <p>This process may take some time.  It is important that you do not close your browser until it has finished.</p>
            </DisplayBox>
        );
    } else return (
        <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Import" saveFunction={handleImport} >
            Previewing:
            <ul className="statusList">
                <li>{props.importData.people.length} people</li>
                <li>{props.importData.groups.length} groups</li>
                <li>{props.importData.visitSessions.length} attendance records</li>
                <li>{props.importData.fundDonations.length} donations</li>
            </ul>
                Please carefully review the preview data and if it looks good, click the Import button to start the import process.
        </InputBox>
    );


}

