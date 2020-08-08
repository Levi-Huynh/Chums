import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeAttendance: React.FC = () => {
    return (
        <div className="homeSection alt" id="attendanceSection">
            <Container>
                <div className="title"><span>Self-Serve Interface</span></div>
                <h2>Checkin and Attendance</h2>
                <Row>
                    <Col lg={6}>
                        <ul>
                            <li>Ensuring the safety of the kids entrusted to your youth and childhood ministries is paramount for any church.</li>
                            <li>Having a check in system helps ensure that kids get returned to the adults who originally checked them in by matching a unique generated code on the child's name tag with a matching code on the adult's checkin receipt.</li>
                            <li>Our app is designed to be a self-serve check-in interface, freeing up time for your volunteers to engage with the children, instead of managing attendance.</li>
                            <li>Members simply search for their family by phone number and select which services will be attended. The app then prints labels and check-in receipts automatically.</li>
                            <li>Church budgets are tight.  That's why our app runs on Android tablets which are readily available for under $80 and can print wirelessly to label printers so that multiple checkin stations can share a single printer.</li>
                            <li>All check-in information is automatically entered into the attendance system, freeing up time that your office staff would otherwise spend having to manually track attendance.</li>
                        </ul>
                    </Col>
                    <Col lg={6}><img src="/images/home/checkin.png" alt="check in" className="img-fluid" /></Col>
                </Row>
            </Container>
        </div >
    );
}
