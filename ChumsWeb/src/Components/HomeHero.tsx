import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'

export const HomeHero: React.FC = () => {
    return (
        <div id="hero">
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} className="text-center">
                        <h1>Completely <span>Free, Open-Source</span><br />Church Management Platform.</h1>
                        <p>Reliable church management software is a critical component for any growing church.  It frees up staff and volunteer time while ensuring processes are adhered to and you are effectively engaging with your congregation and guests.</p>
                        <div><Button variant="success" size="lg" href="#register" >Get Started for Free</Button></div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
