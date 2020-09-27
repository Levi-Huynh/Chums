import React from 'react';
import { ApiHelper, ReportList, ReportInterface, InputBox, ErrorMessages } from './Components';
import { Row, Col, FormGroup, FormLabel, InputGroup, FormControl, Button } from 'react-bootstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';

type TParams = { id?: string };
export const ReportPage = ({ match }: RouteComponentProps<TParams>) => {
    const [report, setReport] = React.useState({} as ReportInterface);
    const [errors, setErrors] = React.useState([]);
    const [redirectUrl, setRedirectUrl] = React.useState("");

    const loadData = () => { ApiHelper.apiGet('/reports/' + match.params.id).then(data => setReport(data)); }
    const redirect = () => { setRedirectUrl("/admin/reports"); }
    const handleSave = () => { if (validate()) ApiHelper.apiPost('/reports', [report]).then(redirect) }
    const handleDelete = () => { if (window.confirm('Are you sure you wish to permanently delete this report?')) ApiHelper.apiDelete('/reports/' + report.id).then(redirect); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }
    const validate = () => {
        var errors = [];
        if (report.title === '') errors.push("Title cannot be blank.");
        setErrors(errors);
        return errors.length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        var r = { ...report };
        switch (e.currentTarget.name) {
            case 'keyName': r.keyName = e.currentTarget.value; break;
            case 'title': r.title = e.currentTarget.value; break;
            case 'query': r.query = e.currentTarget.value; break;
            case 'parameters': r.parameters = e.currentTarget.value; break;
            case 'groupBy': r.groupBy = e.currentTarget.value; break;
        }
        setReport(r);
    }

    React.useEffect(loadData, []);

    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else return (
        <>
            <h1><i className="far fa-chart-bar"></i> Edit Report</h1>
            <Row>
                <Col lg={8}>

                    <InputBox headerIcon="far fa-chart-bar" headerText="Edit Report" saveFunction={handleSave} >
                        <ErrorMessages errors={errors} />
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Key Name</FormLabel>
                                    <FormControl type="text" name="keyName" value={report.keyName} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl type="text" name="title" value={report.title} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Query</FormLabel>
                                    <FormControl as="textarea" rows={8} name="query" value={report.query} onChange={handleChange} onKeyDown={handleKeyDown} style={{ fontSize: 11 }} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Parameters</FormLabel>
                                    <FormControl type="text" name="parameters" value={report.parameters} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Groupings</FormLabel>
                                    <FormControl type="text" name="groupBy" value={report.groupBy} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </InputBox>
                </Col>
                <Col lg={4}>
                    <ReportList />
                </Col>
            </Row>
        </>
    );
}
