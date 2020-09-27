import React from 'react';
import { UserHelper, PersonHelper, NavItems } from './';
import { Link } from 'react-router-dom'
import { Row, Col, Container } from 'react-bootstrap';

export const Header: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const toggleUserMenu = (e: React.MouseEvent) => { e.preventDefault(); setShowUserMenu(!showUserMenu); }

    const getUserMenu = () => {
        if (showUserMenu) {
            const items = [];
            items.push(<Link to="/reports">Reports</Link>);
            if (UserHelper.checkAccess('Site', 'Admin')) items.push(<Link to="/admin/reports">Admin reports</Link>);
            return (
                <div className="container" id="userMenu">
                    <div>
                        <ul className="nav flex-column d-xl-none"><NavItems /></ul>
                        {items}
                        <Link to="/logout">Logout</Link>
                    </div>
                </div>);
        }
        else return null;
    }


    return (
        <>
            <div id="navbar" className="fixed-top">
                <Container>
                    <Row>
                        <div className="col-6 col-lg-2-5"><a className="navbar-brand" href="/"><img src="/images/logo.png" alt="logo" /></a></div>
                        <Col className="d-none d-xl-block" xl={7} style={{ borderLeft: '2px solid #EEE', borderRight: '2px solid #EEE' }}>
                            <ul className="nav nav-fill">
                                <NavItems prefix="main" />
                            </ul>
                        </Col>
                        <div className="col-6 col-lg-2-5 text-right" style={{ paddingTop: 17 }} id="navRight" >
                            <a href="about:blank" onClick={toggleUserMenu} id="userMenuLink">
                                <img src={PersonHelper.getPhotoUrl(UserHelper.person)} alt="user" />
                                {UserHelper.person.name.display} <i className="fas fa-caret-down"></i>
                            </a>
                        </div>
                    </Row>
                </Container>
            </div>
            {getUserMenu()}
            <div id="navSpacer" ></div>
        </>
    );
}
