import React from 'react';
import './Home.css';

function Home() {
    return (
        <div id="middle">
            <img src="/images/logo-home.png" alt="logo" /><br />
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 24 }}><a href="/cp/">Login</a></div>
        </div>
    );
}

export default Home;