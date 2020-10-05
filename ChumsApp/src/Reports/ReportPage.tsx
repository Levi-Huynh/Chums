import React from 'react';
import { ApiHelper, ReportList, ReportInterface, ReportFilter, ReportValueInterface, ReportView, ReportHelper } from './Components';
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps, } from 'react-router-dom';

type TParams = { id?: string };
export const ReportPage = ({ match }: RouteComponentProps<TParams>) => {
    const [report, setReport] = React.useState({} as ReportInterface);

    const loadReport = () => {
        ApiHelper.apiGet('/reports/' + match.params.id).then(data => {
            var r: ReportInterface = data;
            ReportHelper.setDefaultValues(r)
            setReport(r);
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
                    <ReportView report={report} />
                </Col>
                <Col lg={4}>
                    <ReportFilter report={report} updateFunction={handleUpdate} />
                </Col>
            </Row>
        </>
    );
}
