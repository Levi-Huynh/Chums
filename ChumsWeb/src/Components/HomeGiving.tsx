import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeGiving: React.FC = () => {
    return (
        <div className="homeSection">
            <Container>
                <h2>Track <span>Giving</span></h2>
                <Row>
                    <Col><img src="/images/home/giving.png" className="img-fluid" /></Col>
                    <Col>
                        <p>Chums makes it easy to track your giving.  Our batch input makes data entry quick and efficient.  You can export giving data to CSV files to easily prepare giving statements.</p>
                        <p>Create an unlimited number of funds to track gifts to special causes and view breakdowns of giving over time, either by fund or see the big picture.</p>
                    </Col>
                </Row>
            </Container>
        </div >
    );
}
