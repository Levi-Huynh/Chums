import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeMembers: React.FC = () => {
    return (
        <div className="homeSection alt" id="membersSection">
            <Container>
                <Row>
                    <Col lg={6}>
                        <div className="title"><span>Robust Information Tracking</span></div>
                        <h2>Members and Groups</h2>
                        <ul>
                            <li>Easily track all of the pertinent information about your members and guests including contact information, birth dates, relationships and anniversary dates.</li>
                            <li>Create unlimited custom fields to track information unique to your church such as when membership 101 class was attended.</li>
                            <li>You may create an unlimited amount of groups for classes, at-hom small groups, or various ministries.</li>
                            <li>You can also track attendance on each of these groups, if you choose and see reports showing how your groups are growing over time.</li>
                        </ul>
                    </Col>
                    <Col lg={6}><img src="/images/home/members.png" alt="Members" className="img-fluid" /></Col>
                </Row>
            </Container>
        </div >
    );
}
