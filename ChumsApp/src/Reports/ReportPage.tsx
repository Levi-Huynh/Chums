import React from 'react';
import { ApiHelper, ReportList, ReportInterface, ReportFilter, ErrorMessages, GroupedReport, Helper, ReportValueInterface } from './Components';
import { Row, Col, FormGroup, FormLabel, InputGroup, FormControl, Button } from 'react-bootstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';

type TParams = { id?: string };
export const ReportPage = ({ match }: RouteComponentProps<TParams>) => {
    const [report, setReport] = React.useState({} as ReportInterface);

    const loadReport = () => {
        ApiHelper.apiGet('/reports/' + match.params.id).then(data => {
            var r: ReportInterface = data;
            setDefaultValues(r)
            runReport(r);
        });
    }

    const setDefaultValues = (r: ReportInterface) => {
        r.values = [];
        r.parameters.split(',').forEach(p => {
            if (p === "churchId") r.values.push({ key: "churchId", value: 0 });
            if (p === "serviceId") r.values.push({ key: "serviceId", value: 0 });
            if (p === "week") r.values.push({ key: "week", value: Helper.getLastSunday() });
        });
    }

    const runReport = (r: ReportInterface) => {
        const postData = [{ id: r.id, values: r.values }]
        ApiHelper.apiPost('/reports/run', postData).then(data => setReport(data[0]));
    }

    const handleUpdate = (values: ReportValueInterface[]) => {
        var r = { ...report };
        r.values = values;
        runReport(r);
    }

    React.useEffect(loadReport, [match.params]);


    return (
        <>
            <h1><i className="far fa-chart-bar"></i> {report.title}</h1>
            <Row>
                <Col lg={8}>
                    <GroupedReport report={report} />
                </Col>
                <Col lg={4}>
                    <ReportList />
                    <ReportFilter report={report} updateFunction={handleUpdate} />
                </Col>
            </Row>
        </>
    );
}
