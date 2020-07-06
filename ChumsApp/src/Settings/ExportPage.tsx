import React from 'react';
import { DisplayBox, InputBox, ApiHelper, UploadHelper } from './Components';
import { Row, Col } from 'react-bootstrap';
import { ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface, ImportHelper, ImportPersonInterface } from '../Utils/ImportHelper';
import Papa from 'papaparse';


export const ExportPage = () => {
    const [exporting, setExporting] = React.useState(false);
    const [status, setStatus] = React.useState<any>({});
    var progress: any = {};

    var people: ImportPersonInterface[] = [];
    var campuses: ImportCampusInterface[] = [];
    var services: ImportServiceInterface[] = [];
    var serviceTimes: ImportServiceTimeInterface[] = [];

    const setProgress = (name: string, status: string) => {
        progress[name] = status;
        setStatus({ ...progress });
    }

    const getProgress = (name: string) => {
        if (status[name] === undefined) return (<li className="pending">{name}</li>);
        else return (<li className={status[name]}>{name}</li>);
    }

    const getExportSteps = () => {
        if (!exporting) return null;
        else {
            var steps = ['Campuses/Services/Times', 'People', 'Groups', 'Group Members', 'Donations', 'Attendance', 'Compressing'];
            var stepsHtml: JSX.Element[] = [];
            steps.forEach((s) => stepsHtml.push(getProgress(s)));
            return (
                <DisplayBox headerText="Export" headerIcon="fas fa-download">
                    Exporting content:
                    <ul className="statusList">{stepsHtml}</ul>
                    <p>This process may take some time.  It is important that you do not close your browser until it has finished.</p>
                </DisplayBox>
            );
        }
    }

    const getCampusServiceTimes = async () => {
        setProgress('Campuses/Services/Times', 'running');
        var promises = []
        promises.push(ApiHelper.apiGet('/campuses').then(data => campuses = data));
        promises.push(ApiHelper.apiGet('/services').then(data => services = data));
        promises.push(ApiHelper.apiGet('/servicetimes').then(data => serviceTimes = data));
        await Promise.all(promises);
        var data: any[] = [];
        serviceTimes.forEach((st) => {
            var service: ImportServiceInterface = ImportHelper.getById(services, st.serviceId);
            var campus: ImportCampusInterface = ImportHelper.getById(campuses, service.campusId);
            var row = {
                importKey: st.id,
                campus: campus.name,
                service: service.name,
                time: st.name
            }
            data.push(row);
        });
        setProgress('Campuses/Services/Times', 'complete');
        return Papa.unparse(data);
    }

    const getPeople = async () => {
        setProgress('People', 'running');
        people = await ApiHelper.apiGet('/people');
        var data: any[] = [];
        people.forEach((p) => {
            var row = {
                importKey: p.id,
                household: p.lastName,
                lastName: p.lastName, firstName: p.firstName, middleName: p.middleName, nickName: p.nickName,
                birthDate: p.birthDate, gender: p.gender, maritalStatus: p.maritalStatus, membershipStatus: p.membershipStatus,
                homePhone: p.homePhone, mobilePhone: p.mobilePhone, workPhone: p.workPhone, email: p.email,
                address1: p.address1, address2: p.address2, city: p.city, state: p.state, zip: p.zip,
                photo: (p.photoUpdated === undefined) ? '' : p.id.toString() + '.png'
            }
            data.push(row);
        });
        setProgress('People', 'complete');
        return Papa.unparse(data);
    }



    const startExport = async () => {
        setExporting(true);
        var files = [];
        files.push({ name: "services.csv", contents: await getCampusServiceTimes() });
        files.push({ name: "people.csv", contents: await getPeople() });
        UploadHelper.zipFiles(files, "export.zip");
    }

    return (
        <>
            <h1><i className="fas fa-download"></i> Export</h1>
            <Row>
                <Col lg={8}>
                    <InputBox headerIcon="fas fa-download" headerText="Export" saveText="Start Export" saveFunction={startExport}>
                        <p>You can use this tool to export all of your data as a single zip file to either make an offline backup or migrate to another system.  This process can take some time.</p>
                    </InputBox>
                </Col>
                <Col lg={4}>{getExportSteps()}</Col>
            </Row>
        </>
    );
}

