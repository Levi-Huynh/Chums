import React from 'react';
import { DisplayBox, UserHelper, PersonInterface, ApiHelper } from './Components';
import { Row, Col, Alert, Button, Table } from 'react-bootstrap';
import Papa from 'papaparse';

export const ImportPage = () => {
    const [people, setPeople] = React.useState<PersonInterface[]>([]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let files;
        if (e.target) files = e.target.files;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].name.indexOf('people.csv') > -1) loadPeople(files[i]);
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

    const loadPeople = (file: File) => {
        readCsv(file, (data: any[]) => {
            var people: PersonInterface[] = [];
            for (let i = 0; i < data.length; i++) if (data[i].lastName !== undefined) people.push(data[i] as PersonInterface);
            setPeople(people);
        });
    }



    const getPeopleTable = () => {
        if (people.length === 0) return null;
        else {
            var rows = [];
            for (let i = 0; i < people.length; i++) rows.push(<tr><td>{people[i].firstName}</td><td>{people[i].lastName}</td></tr>);
            return (<Table>
                <thead><tr><th>First Name</th><th>Last Name</th></tr></thead>
                <tbody>{rows}</tbody>
            </Table>);
        }
    }

    const getAction = () => {
        if (people.length === 0) return (<Row>
            <Col>Select a File to Upload</Col>
            <Col>
                <input type="file" onChange={handleUpload} id="fileUpload" accept="*/*" style={{ display: 'none' }} />
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
            //clean the data
            people.forEach((p) => {
                if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate);
            });
            ApiHelper.apiPost('/people', people).then(data => { setPeople([]) })
        }
    }




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

