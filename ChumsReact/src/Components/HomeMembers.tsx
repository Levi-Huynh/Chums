import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeMembers: React.FC = () => {
    return (
        <div className="homeSection homeSectionAlt" id="members">
            <Container>
                <h2><span>Members</span> and Groups</h2>
                <Row>
                    <Col><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit ligula sit amet tellus imperdiet, non convallis sapien dignissim. Vivamus sed mollis diam. Suspendisse potenti. Ut faucibus, est quis pellentesque tempus, felis erat sagittis ante, ac bibendum dolor orci vitae mauris. Cras sit amet ante leo. Morbi accumsan elit eget blandit lobortis. Nam varius, quam vel tempus vestibulum, quam nisi malesuada mauris, a viverra ligula risus non nulla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p></Col>
                    <Col>Photo</Col>
                </Row>
            </Container>
        </div >
    );
}
