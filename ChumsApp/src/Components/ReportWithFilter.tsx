import React from 'react';
import { ReportInterface, ReportValueInterface, ReportHelper, ApiHelper } from './';
import { ReportView, ReportFilter } from "../Reports/Components"
import { Row, Col } from 'react-bootstrap';

interface Props { keyName: string }

export const ReportWithFilter: React.FC<Props> = (props) => {
    const [report, setReport] = React.useState({} as ReportInterface);


    const loadReport = () => {
        if (props.keyName !== undefined && props.keyName !== null && props.keyName !== "") {
            ApiHelper.apiGet('/reports/keyName/' + props.keyName).then(data => {
                var r: ReportInterface = data;
                ReportHelper.setDefaultValues(r);
                setReport(r);
            });
        }
    }

    const runReport = (r: ReportInterface) => {
        const postData = [{ id: r.id, values: r.values }]
        ApiHelper.apiPost('/reports/run', postData).then(data => setReport(data[0]));
    }

    const handleFilterUpdate = (values: ReportValueInterface[]) => {
        var r = { ...report };
        r.values = values;
        runReport(r);
    }

    React.useEffect(loadReport, [props.keyName]);

    return (<>
        <Row>
            <Col lg={8}>
                <ReportView report={report} />
            </Col>
            <Col lg={4}>
                <ReportFilter report={report} updateFunction={handleFilterUpdate} />
            </Col>
        </Row>
    </>);
}


