import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'

export const HomeAttendance: React.FC = () => {
    return (
        <div className="homeSection homeSectionAlt" id="attendance">
            <Container>
                <h2><span>Checkin</span> and Attendance</h2>
                <Row>
                    <Col lg={9}>
                        <p>Ensuring the safety of the kids entrusted to your youth and childhood ministries is paramount for any church.
                        Having a check in system helps ensure that kids get returned to the adults who originally checked them in by
                            matching a unique generated code on the child's name tag with a matching code on the adult's checkin receipt.</p>
                        <p>Our app is designed to be a self-serve check-in interface, freeing up time for your volunteers to engage with the children,
                        instead of managing attendance.  Members simply search for their family by phone number and select which services will be attended.
                        The app then prints labels and check-in receipts automatically.</p>
                        <p>We know church budgets are tight, which is why the Chums check-in system was designed with affordable hardware in mind.
                        Our app runs on Android tablets which are readily available for under $80 and can print wirelessly to label printers
                                to that multiple checkin stations can share a single printer.</p>
                        <p>All check-in information is automatically entered into the attendance system, freeing up time that your office staff would otherwise
                            spend having to manually track attendance.</p>
                    </Col>
                    <Col lg={3}><img src="/images/home/checkin.png" alt="check in" className="img-fluid" /></Col>
                </Row>
            </Container>
        </div >
    );
}
