import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div id="middle">
            <img src="/images/logo-home.png" alt="logo" /><br />
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 24 }}><Link to="/cp/">Login</Link></div>
        </div>
    );
}
