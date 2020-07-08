import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'

export const HomeHero: React.FC = () => {
    return (
        <div id="hero">
            <Container>
                <Row>
                    <Col md={6}>
                        <div id="heroInfo">
                            <h1><span className="blue">CHU</span>MS <span style={{ color: '#999' }} >-</span> <span className="blue">Chu</span>rch <span className="blue">M</span>anagement <span className="blue">S</span>oftware</h1>
                            <p>Reliable church management software is a critical component for any growing church.  It frees up staff and volunteer time while ensuring processes are adhered to and you are effectively engaging with your congregation and guests.</p>
                            <div className="text-center"><Button variant="info" size="lg" href="#register" >Get Started Now</Button></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
