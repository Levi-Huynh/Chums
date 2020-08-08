import React from 'react';
import './Home.css';
import { Footer, Header } from './Components'
import { HomeRegister } from './Components/HomeRegister'
import { HomeHero } from './Components/HomeHero'
import { HomeAbout } from './Components/HomeAbout'
import { HomeFeatures } from './Components/HomeFeatures'
import { HomeMembers } from './Components/HomeMembers';
import { HomeGiving } from './Components/HomeGiving';
import { HomeAttendance } from './Components/HomeAttendance';
import { HomeExport } from './Components/HomeExport';
import { HomeTestimony } from './Components/HomeTestimony';

export const Home = () => {
    return (
        <>
            <Header />
            <HomeHero />
            <HomeAbout />
            <HomeFeatures />
            <HomeMembers />
            <HomeGiving />
            <HomeAttendance />
            <HomeExport />
            <HomeTestimony />

            <HomeRegister />
            <Footer />
        </>
    );
}
