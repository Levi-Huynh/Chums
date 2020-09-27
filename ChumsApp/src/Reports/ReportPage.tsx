import React from 'react';
import { ApiHelper, ReportList, ReportInterface, InputBox, ErrorMessages, GroupingReport } from './Components';
import { Row, Col, FormGroup, FormLabel, InputGroup, FormControl, Button } from 'react-bootstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';

type TParams = { id?: string };
export const ReportPage = ({ match }: RouteComponentProps<TParams>) => {
    const [report, setReport] = React.useState({} as ReportInterface);

    const loadData = () => {
        const postData = [{ id: match.params.id }]
        ApiHelper.apiPost('/reports/run', postData).then(data => setReport(data[0]));
    }
    React.useEffect(loadData, []);


    return (
        <>
            <h1><i className="far fa-chart-bar"></i> {report.title}</h1>
            <Row>
                <Col lg={8}>
                    <GroupingReport report={report} />
                </Col>
                <Col lg={4}>
                    <ReportList />
                </Col>
            </Row>
        </>
    );
}
