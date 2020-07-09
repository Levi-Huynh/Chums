import React from 'react';
import { UserHelper } from './'
import { Link } from 'react-router-dom';

export const Sidebar = () => {

    const getClass = (sectionName: string): string => {
        if (sectionName === '') return '';
        else return 'nav-link';
    }

    const getTab = (key: string, url: string, icon: string, label: string) => {
        return (<li key={key} className="nav-item"><Link className={getClass(key)} to={url}><i className={icon}></i> {label}</Link></li>);
    }

    const getTabs = () => {
        var tabs = [];
        tabs.push(getTab('people', '/people', 'fas fa-user', 'People'));
        if (UserHelper.checkAccess('Groups', 'View')) tabs.push(getTab('groups', '/groups', 'fas fa-list-ul', 'Groups'));
        if (UserHelper.checkAccess('Attendance', 'View Summary')) tabs.push(getTab('attendance', '/attendance', 'far fa-calendar-alt', 'Attendance'));
        if (UserHelper.checkAccess('Donations', 'View Summary')) tabs.push(getTab('donations', '/donations', 'fas fa-hand-holding-usd', 'Donations'));
        if (UserHelper.checkAccess('Forms', 'View')) tabs.push(getTab('forms', '/forms', 'fas fa-align-left', 'Forms'));
        //if (UserHelper.checkAccess('Tasks', 'View')) tabs.push(getTab('forms', '/tasks', 'fas fa-tasks', 'Tasks'));
        if (UserHelper.checkAccess('Roles', 'View')) tabs.push(getTab('settings', '/settings', 'fas fa-cog', 'Settings'));
        return tabs;
    }

    return (
        <nav className="col-sm-6 col-xl-2 d-none d-xl-block bg-dark sidebar" id="sidebar">
            <ul className="nav flex-column">
                {getTabs()}
            </ul>
        </nav>
    );
}
