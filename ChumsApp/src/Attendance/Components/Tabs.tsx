import React from 'react';
import { UserHelper, AttendanceFilterInterface, Individuals, Attendance, ReportWithFilter } from './';


//interface Props { filter: AttendanceFilterInterface }

//unused

export const Tabs: React.FC = () => {
    const [selectedTab, setSelectedTab] = React.useState('');

    const getTab = (keyName: string, icon: string, text: string) => {
        var className = (keyName === selectedTab) ? 'nav-link active' : 'nav-link';
        return <li className="nav-item" key={keyName}><a href="about:blank" onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }

    var tabs = [];
    var defaultTab = '';
    var currentTab = null;
    if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('attendance', 'far fa-calendar-alt', 'Attendance Trend')); if (defaultTab === '') defaultTab = 'attendance'; }
    if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('groups', 'fas fa-user', 'Group Attendance')); if (defaultTab === '') defaultTab = 'groups'; }
    //if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('individuals', 'fas fa-user', 'People')); if (defaultTab === '') defaultTab = 'individuals'; }
    if (selectedTab === '' && defaultTab !== '') setSelectedTab(defaultTab);

    switch (selectedTab) {
        case 'attendance': currentTab = <ReportWithFilter keyName="attendanceTrend" />; break;
        case 'groups': currentTab = <ReportWithFilter keyName="groupAttendance" />; break;
        //case 'individuals': currentTab = <Individuals filter={props.filter} />; break;
        default: currentTab = <div>Not implemented</div>; break;
    }

    return (<>
        <ul id="attendanceTabs" className="nav nav-tabs">{tabs}</ul>{currentTab}
    </>);
}