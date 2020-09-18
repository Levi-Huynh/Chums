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

        await runImport('Funds', async () => {
            await ApiHelper.apiPost('/funds', tmpFunds).then(result => {
                for (let i = 0; i < result.length; i++) tmpFunds[i].id = result[i].id;
            });;
        });

        await runImport('Donation Batches', async () => {
            await ApiHelper.apiPost('/donationbatches', tmpBatches).then(result => {
                for (let i = 0; i < result.length; i++) tmpBatches[i].id = result[i].id;
            });;
        });

        await runImport('Donations', async () => {
            tmpDonations.forEach((d) => {
                d.batchId = ImportHelper.getByImportKey(tmpBatches, d.batchKey).id;
                d.personId = ImportHelper.getByImportKey(tmpPeople, d.personKey)?.id;
            });
            await ApiHelper.apiPost('/donations', tmpDonations).then(result => {
                for (let i = 0; i < result.length; i++) tmpDonations[i].id = result[i].id;
            });;
        });

        await runImport('Donation Funds', async () => {
            var tmpFundDonations: ImportFundDonationInterface[] = [...props.importData.fundDonations];
            tmpFundDonations.forEach((fd) => {
                fd.donationId = ImportHelper.getByImportKey(tmpDonations, fd.donationKey).id;
                fd.fundId = ImportHelper.getByImportKey(tmpFunds, fd.fundKey).id;
            });
            await ApiHelper.apiPost('/funddonations', tmpFundDonations).then(result => {
                for (let i = 0; i < result.length; i++) tmpFundDonations[i].id = result[i].id;
            });;
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
            await ApiHelper.apiPost('/sessions', tmpSessions).then(result => {
                for (let i = 0; i < result.length; i++) tmpSessions[i].id = result[i].id;
            });;
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
            await ApiHelper.apiPost('/visits', tmpVisits).then(result => {
                for (let i = 0; i < result.length; i++) tmpVisits[i].id = result[i].id;
            });;
        });

        await runImport('Group Attendance', async () => {
            var tmpVisitSessions: ImportVisitSessionInterface[] = [...props.importData.visitSessions];
            tmpVisitSessions.forEach((vs) => {
                vs.visitId = ImportHelper.getByImportKey(tmpVisits, vs.visitKey).id;
                vs.sessionId = ImportHelper.getByImportKey(tmpSessions, vs.sessionKey).id;
            });
            await ApiHelper.apiPost('/visitsessions', tmpVisitSessions).then(result => {
                for (let i = 0; i < result.length; i++) tmpVisitSessions[i].id = result[i].id;
            });;
        });
    }

    const importGroups = async (tmpPeople: ImportPersonInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var tmpGroups: ImportGroupInterface[] = [...props.importData.groups];
        var tmpTimes: ImportGroupServiceTimeInterface[] = [...props.importData.groupServiceTimes];
        var tmpMembers: ImportGroupMemberInterface[] = [...props.importData.groupMembers];

        await runImport('Groups', async () => {
            await ApiHelper.apiPost('/groups', tmpGroups).then(result => {
                for (let i = 0; i < result.length; i++) tmpGroups[i].id = result[i].id;
            });;
        });

        await runImport('Group Service Times', async () => {
            tmpTimes.forEach((gst) => {
                gst.groupId = ImportHelper.getByImportKey(tmpGroups, gst.groupKey).id
                gst.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, gst.serviceTimeKey).id
            });
            await ApiHelper.apiPost('/groupservicetimes', tmpTimes).then(result => {
                for (let i = 0; i < result.length; i++) tmpTimes[i].id = result[i].id;
            });;
        });

        await runImport('Group Members', async () => {
            tmpMembers.forEach((gm) => {
                gm.groupId = ImportHelper.getByImportKey(tmpGroups, gm.groupKey).id
                gm.personId = ImportHelper.getByImportKey(tmpPeople, gm.personKey).id
            });
            await ApiHelper.apiPost('/groupmembers', tmpMembers).then(result => {
                for (let i = 0; i < result.length; i++) tmpMembers[i].id = result[i].id;
            });;
        });

        return tmpGroups;
    }

    const importCampuses = async () => {
        var tmpCampuses: ImportCampusInterface[] = [...props.importData.campuses];
        var tmpServices: ImportServiceInterface[] = [...props.importData.services];
        var tmpServiceTimes: ImportServiceTimeInterface[] = [...props.importData.serviceTimes];

        await runImport('Campuses', async () => {
            await ApiHelper.apiPost('/campuses', tmpCampuses).then(result => {
                for (let i = 0; i < result.length; i++) tmpCampuses[i].id = result[i].id;
            });
        });

        await runImport('Services', async () => {
            tmpServices.forEach((s) => { s.campusId = ImportHelper.getByImportKey(tmpCampuses, s.campusKey).id });
            await ApiHelper.apiPost('/services', tmpServices).then(result => {
                for (let i = 0; i < result.length; i++) tmpServices[i].id = result[i].id;
            });;
        });

        await runImport('Service Times', async () => {
            tmpServiceTimes.forEach((st) => { st.serviceId = ImportHelper.getByImportKey(tmpServices, st.serviceKey).id });
            await ApiHelper.apiPost('/servicetimes', tmpServiceTimes).then(result => {
                for (let i = 0; i < result.length; i++) tmpServiceTimes[i].id = result[i].id;
            });;
        });
        return { campuses: tmpCampuses, services: tmpServices, serviceTimes: tmpServiceTimes };
    }

    const importPeople = async () => {
        var tmpPeople: ImportPersonInterface[] = [...props.importData.people];
        var tmpHouseholds: ImportHouseholdInterface[] = [...props.importData.households];

        tmpPeople.forEach((p) => {
            if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate);
        });

        await runImport('Households', async () => {
            await ApiHelper.apiPost('/households', tmpHouseholds).then(result => {
                for (let i = 0; i < result.length; i++) tmpHouseholds[i].id = result[i].id;
            });
        });

        await runImport('People', async () => {

            tmpPeople.forEach((p) => {
                try {
                    p.householdId = ImportHelper.getByImportKey(tmpHouseholds, p.householdKey).id;
                    p.householdRole = 'Other';
                } catch { }
            });

            await ApiHelper.apiPost('/people', tmpPeople).then(result => {
                for (let i = 0; i < result.length; i++) tmpPeople[i].id = result[i].id;
            });;
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

