import React from 'react';
import { UserHelper } from './';
import { AttendanceFilterInterface } from '../../../Utils';
import { Individuals, Attendance } from './';

interface Props {
    filter: AttendanceFilterInterface
}

export const Tabs: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState('');

    const getTab = (keyName: string, icon: string, text: string) => {
        var className = (keyName === selectedTab) ? 'nav-link active' : 'nav-link';
        return <li className="nav-item" key={keyName}><a href="#" onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }


    var tabs = [];
    var defaultTab = '';
    var currentTab = null;
    if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('attendance', 'far fa-calendar-alt', 'Attendance')); if (defaultTab === '') defaultTab = 'attendance'; }
    if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('individuals', 'fas fa-user', 'People')); if (defaultTab === '') defaultTab = 'individuals'; }
    if (selectedTab === '' && defaultTab !== '') setSelectedTab(defaultTab);

    switch (selectedTab) {
        case 'attendance': currentTab = <Attendance filter={props.filter} />; break;
        case 'individuals': currentTab = <Individuals filter={props.filter} />; break;
        default: currentTab = <div>Not implemented</div>; break;
    }

    return (<><ul className="nav nav-tabs">{tabs}</ul>{currentTab}</>);
}