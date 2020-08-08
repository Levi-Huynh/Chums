import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'

export const HomeAbout: React.FC = () => {
    return (
        <div className="homeSection alt" id="aboutSection">
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} className="text-center">
                        <div className="title"><span>Chu</span>rch <span>M</span>anagement <span>S</span>oftware</div>
                        <h2>About CHUMS</h2>
                        <p className="lead">CHUMS is a completely free service provided to Christian churches and ministries.</p>
                        <p>
                            Every year the Church spends over <b>$800 million</b> on church management software.
                            We believe that money can be put to better use, which is why we developed CHUMS; a completely free, open-source church management platform.
                            We are a <b>501(c)(3) non profit</b> providing a free alternative to other paid church management platforms.
                            Visit our <a href="https://github.com/LiveChurchSolutions/Chums" target="_blank" rel="noopener noreferrer" >GitHub</a> page to host CHUMS yourself, or let us host it for you by registering for a free account below.
                        </p>
                        <p>CHUMS is built and provided free of charge by <a href="https://livecs.org/">Live Church Solutions</a></p>
                        <Button variant="light" href="https://livecs.org/" >Learn More</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
