import React, { Fragment } from 'react';
import { AttendanceHelper, UserHelper, GroupInterface, GroupMembers, GroupSessions, SessionInterface, Attendance, PersonInterface } from './';

interface Props {
    group: GroupInterface
    addedPerson?: PersonInterface,
    addedSession?: SessionInterface,
    addedCallback: () => void,
    sidebarVisibilityFunction: (name: string, visible: boolean) => void
}

export const Tabs: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState('');

    const getTab = (keyName: string, icon: string, text: string) => {
        var className = (keyName === selectedTab) ? 'nav-link active' : 'nav-link';
        return <li className="nav-item" key={keyName}><a href="#" onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }

    const setVisibilityState = () => {
        props.sidebarVisibilityFunction('addPerson', false);
        props.sidebarVisibilityFunction('addSession', false);
        props.sidebarVisibilityFunction('addMember', false);

        if (selectedTab == 'members') props.sidebarVisibilityFunction('addPerson', true);
        if (selectedTab == 'sessions') {
            props.sidebarVisibilityFunction('addPerson', true);
            props.sidebarVisibilityFunction('addMember', true);
        }
    }

    const getCurrentTab = () => {

        var filter = AttendanceHelper.createFilter();
        filter.groupId = props.group.id;

        var currentTab = null;
        switch (selectedTab) {
            case 'members': currentTab = <GroupMembers group={props.group} addedPerson={props.addedPerson} addedCallback={props.addedCallback} />; break;
            case 'sessions': currentTab = <GroupSessions group={props.group} sidebarVisibilityFunction={props.sidebarVisibilityFunction} addedSession={props.addedSession} addedPerson={props.addedPerson} addedCallback={props.addedCallback} />; break;
            case 'trends': currentTab = <Attendance filter={filter} />; break;
            default: currentTab = <div>Not implemented</div>; break;
        }
        return currentTab
    }


    const getTabs = () => {
        if (props.group === null || props.group.id === undefined) return null;
        var tabs = [];
        var defaultTab = ''

        if (UserHelper.checkAccess('Group Members', 'View')) { tabs.push(getTab('members', 'fas fa-users', 'Members')); defaultTab = 'members'; }
        if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('sessions', 'far fa-calendar-alt', 'Sessions')); if (defaultTab === '') defaultTab = 'sessions'; }
        if (UserHelper.checkAccess('Attendance', 'View Summary')) { tabs.push(getTab('trends', 'far fa-chart-bar', 'Trends')); if (defaultTab === '') defaultTab = 'trends'; }
        if (selectedTab === '' && defaultTab !== '') setSelectedTab(defaultTab);
        return tabs;
    }

    React.useEffect(setVisibilityState, [selectedTab]);




    return (<><ul className="nav nav-tabs">{getTabs()}</ul>{getCurrentTab()}</>);
}