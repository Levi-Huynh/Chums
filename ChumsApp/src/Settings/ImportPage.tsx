import React from 'react';
import { DisplayBox, UserHelper, PersonInterface, ApiHelper, HouseholdInterface, HouseholdMemberInterface, ImportPreview, ImportHelper, InputBox } from './Components';
import { Row, Col, Button } from 'react-bootstrap';


export const ImportPage = () => {
    const [people, setPeople] = React.useState<PersonInterface[]>([]);
    const [households, setHouseholds] = React.useState<HouseholdInterface[]>([]);
    const [householdMembers, setHouseholdMembers] = React.useState<HouseholdMemberInterface[]>([]);
    const [triggerRender, setTriggerRender] = React.useState(0);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target) {
            let files = e.target.files;
            if (files.length > 0) {
                ImportHelper.getCsv(files, 'people.csv', (data: any) => { loadPeople(data, files) });
                ImportHelper.getCsv(files, 'households.csv', loadHouseholds);
                ImportHelper.getCsv(files, 'householdmembers.csv', loadHouseholdMembers);
            }
        }
    }

    const loadPeople = (data: any, allFiles: FileList) => {
        var people: PersonInterface[] = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].lastName !== undefined) {
                var p = data[i] as PersonInterface;
                if (p.photo !== undefined) ImportHelper.readImage(allFiles, p, () => { setTriggerRender(Math.random()); });
                people.push(p);
            }
        }
        setPeople(people);
    }

    const loadHouseholds = (data: any) => {
        var households: HouseholdInterface[] = [];
        for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) households.push(data[i] as HouseholdInterface);
        setHouseholds(households);
    }

    const loadHouseholdMembers = (data: any) => {
        var householdMembers: HouseholdMemberInterface[] = [];
        for (let i = 0; i < data.length; i++) if (data[i].householdKey !== undefined) householdMembers.push(data[i] as HouseholdMemberInterface);
        setHouseholdMembers(householdMembers);
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
                    <ImportPreview people={people} households={households} householdMembers={householdMembers} triggerRender={triggerRender} />
                </Col>
                <Col lg={4}>
                    {getAction()}
                </Col>
            </Row>
        </>
    );
}

