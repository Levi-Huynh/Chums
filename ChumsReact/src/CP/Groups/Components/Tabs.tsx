import React, { Fragment } from 'react';
import { UserHelper, GroupInterface, GroupMembers } from './';
import { PersonInterface } from '../../../Utils';

interface Props {
    group: GroupInterface
    addedPerson?: PersonInterface
}

export const Tabs: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState('');

    const getTab = (keyName: string, icon: string, text: string) => {
        var className = (keyName === selectedTab) ? 'nav-link active' : 'nav-link';
        return <li className="nav-item" key={keyName}><a href="#" onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }


    if (props.group === null || props.group.id === undefined) return null;
    var tabs = [];
    var defaultTab = ''
    var currentTab = null;
    if (UserHelper.checkAccess('Group Members', 'View')) { tabs.push(getTab('members', 'fas fa-users', 'Members')); defaultTab = 'members'; }
    if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('sessions', 'far fa-calendar-alt', 'Sessions')); if (defaultTab === '') defaultTab = 'sessions'; }
    if (UserHelper.checkAccess('Attendance', 'View Summary')) { tabs.push(getTab('trends', 'far fa-chart-bar', 'Trends')); if (defaultTab === '') defaultTab = 'trends'; }
    if (selectedTab === '' && defaultTab !== '') setSelectedTab(defaultTab);

    switch (selectedTab) {
        case 'members': currentTab = <GroupMembers group={props.group} addedPerson={props.addedPerson} />; break;
        default: currentTab = <div>Not implemented</div>; break;
    }

    return (<><ul className="nav nav-tabs">{tabs}</ul>{currentTab}</>);
}