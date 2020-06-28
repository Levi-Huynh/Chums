import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'
import { Register } from './Components'

export const Home = () => {
    return (
        <>
            <div className="container" style={{ marginTop: 200 }}>
                <div className="row">
                    <div className="col-6">
                        <img src="/images/logo-home.png" alt="logo" /><br />
                        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 24 }}><Link to="/cp/">Login</Link></div>
                    </div>
                    <div className="col-6">
                        <Register />
                    </div>
                </div>
            </div>

        </>
    );
}
