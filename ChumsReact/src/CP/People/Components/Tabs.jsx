import React, { Fragment } from 'react';
import UserHelper from '../../../Utils/UserHelper';
import Notes from '../../Components/Notes'

const Tabs = (props) => {
    const [personId, setPersonId] = React.useState(props.personId);
    const [selectedTab, setSelectedTab] = React.useState('');

    const getTab = (keyName, icon, text) => {
        var className = (keyName === selectedTab) ? 'nav-link active' : 'nav-link';
        return <li className="nav-item" key={keyName}><a href="#" onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
    }

    React.useEffect(() => setPersonId(props.personId), [props.personId]);

    if (props.personId === undefined || props.personId === null) return null;
    var tabs = [];
    var defaultTab = ''
    var currentTab = null;
    if (UserHelper.checkAccess('People', 'View Notes')) { tabs.push(getTab('notes', 'far fa-sticky-note', 'Notes')); defaultTab = 'notes'; }
    if (UserHelper.checkAccess('Attendance', 'View')) { tabs.push(getTab('attendance', 'far fa-calendar-alt', 'Attendance')); if (defaultTab === '') defaultTab = 'attendance'; }
    if (UserHelper.checkAccess('Donations', 'View Individual')) { tabs.push(getTab('donations', 'fas fa-hand-holding-usd', 'Donations')); if (defaultTab === '') defaultTab = 'donations'; }
    if (selectedTab === '' && defaultTab !== '') setSelectedTab(defaultTab);

    switch (selectedTab) {
        case 'notes': currentTab = <Notes contentType="person" contentId={personId} />; break;
        default: currentTab = <div>Not implemented</div>; break;
    }

    return (<><ul className="nav nav-tabs">{tabs}</ul>{currentTab}</>);
}

export default Tabs;