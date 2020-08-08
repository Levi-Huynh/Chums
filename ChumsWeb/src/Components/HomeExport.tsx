import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeExport: React.FC = () => {
    return (
        <div className="homeSection" id="exportSection">
            <Container>
                <Row>
                    <Col lg={{ span: 6, order: 2 }}>
                        <div className="title"><span>Import and Export</span></div>
                        <h2>You Own Your Data</h2>
                        <ul>
                            <li>Use our import tool to bring in any existing data you may have and use our export tool at any time to take your data with you.</li>
                            <li>If you choose, you may also completely delete all data from CHUMS any time you wish.</li>
                        </ul>
                    </Col>
                    <Col lg={{ span: 6, order: 1 }}>
                        <Col><img src="/images/home/export.png" alt="import and export" className="img-fluid" /></Col>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
