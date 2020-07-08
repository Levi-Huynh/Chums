import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeMembers: React.FC = () => {
    return (
        <div className="homeSection homeSectionAlt" id="members">
            <Container>
                <h2><span>Members</span> and Groups</h2>
                <Row>
                    <Col>
                        <p>Easily track all of the pertinent information about your members and guests including contact information, birth dates, relationships, and anniversary dates.  Create unlimited custom fields to track information unique to your church such as date 101 class was attended.</p>
                        <p>You may also create an unlimited amount of groups for classes, at-home small groups, or various ministries.  Keep track of which members are a part of each of these groups to make it easy to send out emails.  You can also track attendance on each of the groups, if you choose and see reports showing how your groups are growing over time.</p>
                    </Col>
                    <Col><img src="/images/home/members.png" alt="Members" /></Col>
                </Row>
            </Container>
        </div >
    );
}
