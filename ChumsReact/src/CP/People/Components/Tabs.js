import React from 'react';
import DisplayBox from '../../Components/DisplayBox'
import ApiHelper from '../../../Utils/ApiHelper';
import { Link } from 'react-router-dom';
import UserHelper from '../../../Utils/UserHelper';

class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = { personId: null, selectedTab: '' };
    }

    toggleTab(keyName, e) {
        if (e !== undefined) e.preventDefault();

    }

    componentDidUpdate(prevProps) {

    }

    getTab(keyName, icon, text) {
        var className = (keyName === this.state.selectedTab) ? 'nav-link active' : 'nav-link';
        return <li class="nav-item"><a href="#" onClick={this.toggleTab(keyName)} className={className}><i class={icon}></i> {text}</a></li>
    }

    render() {
        var tabs = [];
        var defaultTab = ''
        if (UserHelper.checkAccess('People', 'View Notes')) {
            tabs.push(this.getTab('notes', 'far fa-sticky-note', 'Notes'));
            defaultTab = 'notes';
        }
        if (UserHelper.checkAccess('Attendance', 'View')) {
            tabs.push(this.getTab('attendance', 'far fa-calendar-alt', 'Attendance'));
            if (defaultTab === '') defaultTab = 'attendance';
        }
        if (UserHelper.checkAccess('Donations', 'View Individual')) {
            tabs.push(this.getTab('donations', 'fas fa-hand-holding-usd', 'Donations'));
            if (defaultTab === '') defaultTab = 'donations';
        }
        if (this.state.selectedTab === '' && defaultTab !== '') this.setState({ selectedTab: defaultTab });

        return (
            <ul class="nav nav-tabs">{tabs}</ul>
        )
    }
}

export default Tabs;