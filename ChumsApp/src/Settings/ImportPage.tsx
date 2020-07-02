import React from 'react';
import { DisplayBox, UserHelper, PersonInterface, ApiHelper } from './Components';
import { Row, Col, Alert, Button, Table } from 'react-bootstrap';
import Papa from 'papaparse';

export const ImportPage = () => {
    const [people, setPeople] = React.useState<PersonInterface[]>([]);
    const [triggerRender, setTriggerRender] = React.useState(0);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let files;
        if (e.target) files = e.target.files;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].name.indexOf('people.csv') > -1) loadPeople(files[i], files);
            }
        }

    }

    const getStrippedRecord = (r: any) => {
        var names = Object.getOwnPropertyNames(r)
        for (let j = names.length - 1; j >= 0; j--) {
            var n = names[j];
            if (r[n] == '') delete r[n];
        }
        return r;
    }

    const readCsv = (file: File, callBack: (data: any[]) => void) => {
        const reader = new FileReader();
        reader.onload = () => {
            var result = [];
            var csv = reader.result.toString();
            var data = Papa.parse(csv, { header: true });

            for (let i = 0; i < data.data.length; i++) {
                var r: any = getStrippedRecord(data.data[i]);
                result.push(r);
            }
            callBack(result);
        };
        reader.readAsText(file);
    }

    const readImage = (files: FileList, person: PersonInterface) => {
        for (let i = 0; i < files.length; i++) {
            if (files[i].name === person.photo) {
                const reader = new FileReader();
                reader.onload = () => {
                    person.photo = (reader.result.toString());
                    setTriggerRender(Math.random());
                };
                reader.readAsDataURL(files[i]);
            }
        }
    }


    const loadPeople = (file: File, allFiles: FileList) => {
        readCsv(file, (data: any[]) => {
            var people: PersonInterface[] = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].lastName !== undefined) {
                    var p = data[i] as PersonInterface;
                    if (p.photo !== undefined) readImage(allFiles, p);
                    people.push(p);
                }
            }
            setPeople(people);
        });
    }

    const getPeopleTable = () => {
        if (people.length === 0) return null;
        else {
            if (triggerRender > -1) {
                var rows = [];
                for (let i = 0; i < people.length; i++) {
                    var p = people[i];
                    var imgTag = (p.photo === undefined) ? null : <img src={p.photo} className="personPhoto" />;
                    rows.push(<tr><td>{imgTag}</td><td>{people[i].firstName}</td><td>{people[i].lastName}</td></tr>);
                }
                return (<Table>
                    <thead><tr><th>Photo</th><th>First Name</th><th>Last Name</th></tr></thead>
                    <tbody>{rows}</tbody>
                </Table>);
            }
        }
        return null;
    }

    const getAction = () => {
        if (people.length === 0) return (<Row>
            <Col>Select a File to Upload</Col>
            <Col>
                <input type="file" onChange={handleUpload} id="fileUpload" accept="*/*" multiple style={{ display: 'none' }} />
                <Button variant="info" block onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById('fileUpload').click(); }} >Upload</Button>
            </Col>
        </Row>);
        else return (<Row>
            <Col>Review Your Data and Import</Col>
            <Col>
                <Button variant="primary" block onClick={handleImport} >Import</Button>
            </Col>
        </Row>);
    }

    const handleImport = (e: React.MouseEvent) => {
        e.preventDefault();
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
            <Alert variant="warning">Use with caution</Alert>
            <Row>
                <Col lg={8}>
                    <DisplayBox headerText="Import" headerIcon="fas fa-lock" >
                        {getAction()}
                        {getPeopleTable()}
                    </DisplayBox>
                </Col>
                <Col lg={4}>

                </Col>
            </Row>
        </>
    );
}

