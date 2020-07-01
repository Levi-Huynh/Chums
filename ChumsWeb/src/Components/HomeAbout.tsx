import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeAbout: React.FC = () => {
    return (
        <div className="homeSection">
            <Container>
                <h2>About <span>CHUMS</span></h2>
                <p>
                    Every year the Church spends over $800 million on church management software.
                    We believe that money can be put to better use, which is why we developed CHUMS; completely free, open-source <b ><span className="blue">chu</span>rch <span className="blue">m</span>anagement <span className="blue">s</span>oftware</b>.
                    Visit our <a href="https://github.com/LiveChurchSolutions/Chums" target="_blank" >GitHub</a> page to host CHUMS yourself, or let us host it for you by registering for a free account below.
                </p>
                <p>CHUMS is built and provided free of charge by <a href="https://livecs.org/">Live Church Solutions</a> 501(c)3.</p>
            </Container>
        </div>
    );
}
