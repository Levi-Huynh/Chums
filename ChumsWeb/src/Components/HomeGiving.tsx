import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeGiving: React.FC = () => {
    return (
        <div className="homeSection">
            <Container>
                <h2>Track <span>Giving</span></h2>
                <Row>
                    <Col><img src="/images/home/giving.png" className="img-fluid" /></Col>
                    <Col><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit ligula sit amet tellus imperdiet, non convallis sapien dignissim. Vivamus sed mollis diam. Suspendisse potenti. Ut faucibus, est quis pellentesque tempus, felis erat sagittis ante, ac bibendum dolor orci vitae mauris. Cras sit amet ante leo. Morbi accumsan elit eget blandit lobortis. Nam varius, quam vel tempus vestibulum, quam nisi malesuada mauris, a viverra ligula risus non nulla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p></Col>
                </Row>
            </Container>
        </div >
    );
}
