import React from 'react';
import './Home.css';
import { Footer } from './Components'
import { HomeRegister } from './Components/HomeRegister'
import { HomeHero } from './Components/HomeHero'
import { HomeAbout } from './Components/HomeAbout'
import { Navbar, Nav } from 'react-bootstrap'
import { HomeMembers } from './Components/HomeMembers';
import { HomeGiving } from './Components/HomeGiving';
import { HomeAttendance } from './Components/HomeAttendance';

export const Home = () => {
    return (
        <>
            <Navbar>
                <Navbar.Brand href="/"><img src="/images/logo.png" alt="logo" /></Navbar.Brand>
                <Navbar.Collapse id="navbar">
                    <Nav className="mr-auto"></Nav>
                    <Nav className="ml-auto"><Nav.Link href="/cp/">Login</Nav.Link></Nav>
                </Navbar.Collapse>
            </Navbar>

            <HomeHero />
            <HomeAbout />
            <HomeMembers />
            <HomeGiving />
            <HomeAttendance />
            <HomeRegister />
            <Footer />



        </>
    );
}
