import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap'
import { HomeFeature } from './HomeFeature';

export const HomeFeatures: React.FC = () => {
    return (
        <div className="homeSection" id="featuresSection">
            <Container>
                <div className="text-center">
                    <div className="title">Features</div>
                    <h2>Say Goodbye to<br />Excel Documents.</h2>
                    <Row>
                        <Col md={4}><HomeFeature icon="far fa-user" title="People" content="Easily track pertinent information on all your members and guests" /></Col>
                        <Col md={4}><HomeFeature icon="far fa-calendar-check" title="Attendance" content="Save time tracking attendance with our self check-in app" /></Col>
                        <Col md={4}><HomeFeature icon="fas fa-users" title="Groups" content="Easily manage classes, small groups and missions" /></Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                            <Row>
                                <Col md={6}><HomeFeature icon="fas fa-hand-holding-usd" title="Giving" content="Quickly enter donations and see reports showing giving over time." /></Col>
                                <Col md={6}><HomeFeature icon="fas fa-align-left" title="Forms" content="Build custom forms to collect any information you would like." /></Col>
                            </Row>
                        </Col>
                    </Row>

                    <div><Button variant="success" size="lg" href="#register" >Get Started for Free</Button></div>
                </div>
            </Container>
        </div>
    );
}
