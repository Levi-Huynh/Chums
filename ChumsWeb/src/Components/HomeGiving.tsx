import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeGiving: React.FC = () => {
    return (
        <div className="homeSection" id="givingSection">
            <Container>

                <Row>
                    <Col lg={{ span: 6, order: 2 }} >
                        <div className="title"><span>Easy, Quick and Efficient</span></div>
                        <h2>Track Giving</h2>
                        <ul>
                            <li>CHUMS makes it easy to track your giving.  Our batch input makes data entry quick and efficient.</li>
                            <li>You can export giving data to CSV files to easily prepare giving statements.</li>
                            <li>Create an unlimited number of funds to track gifts to special causes and view breakdwons of giving over time, either by fund or see the big picture.</li>
                        </ul>
                    </Col>
                    <Col lg={{ span: 6, order: 1 }} ><img src="/images/home/giving.png" alt="giving" className="img-fluid" /></Col>
                </Row>
            </Container>
        </div >
    );
}
