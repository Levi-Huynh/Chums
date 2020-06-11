import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Sidebar = () => {

    const getClass = (sectionName: string): string => {
        if (sectionName === '') return '';
        else return 'nav-link';
    }

    return (
        <nav className="col-sm-3 col-md-2 d-none d-md-block bg-dark sidebar" id="sidebar">
            <ul className="nav flex-column">
                <li className="nav-item"><NavLink className={getClass('people')} to="/cp/people"><i className="fas fa-user"></i> People</NavLink></li>
                <li className="nav-item"><NavLink className={getClass('groups')} to="/cp/groups"><i className="fas fa-list-ul"></i> Groups</NavLink></li>
                <li className="nav-item"><Link className={getClass('attendance')} to="/cp/attendance/"><i className="far fa-calendar-alt"></i> Attendance</Link></li>
                <li className="nav-item"><Link className={getClass('donations')} to="/cp/donations/"><i className="fas fa-hand-holding-usd"></i> Donations</Link></li>
                <li className="nav-item"><Link className={getClass('forms')} to="/cp/forms/"><i className="fas fa-align-left"></i> Forms</Link></li>
                <li className="nav-item"><Link className={getClass('tasks')} to="/cp/tasks/"><i className="fas fa-tasks"></i> Tasks</Link></li>
                <li className="nav-item"><Link className={getClass('settings')} to="/cp/settings/"><i className="fas fa-cog"></i> Settings</Link></li>
            </ul>
        </nav>
    );
}
