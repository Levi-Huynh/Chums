import React from 'react';
import { ApiHelper, ReportList, ReportInterface } from './Components';
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';

export const ReportsPage = () => {



    return (
        <>
            <h1><i className="far fa-chart-bar"></i> Reports</h1>
            <Row>
                <Col lg={8}>
                    <p>Select a report to edit.</p>
                </Col>
                <Col lg={4}>
                    <ReportList />
                </Col>
            </Row>
        </>
    );
}
