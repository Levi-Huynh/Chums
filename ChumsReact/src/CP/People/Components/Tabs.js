import React, { Fragment } from 'react';
import UserHelper from '../../../Utils/UserHelper';
import Notes from '../../Components/Notes'

class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = { personId: this.props.personId, selectedTab: '' };
    }

    toggleTab(keyName) {
        this.setState({ selectedTab: keyName });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.personId !== this.props.personId) this.setState({ personId: this.props.personId })
    }

    getTab(keyName, icon, text) {
        var className = (keyName === this.state.selectedTab) ? 'nav-link active' : 'nav-link';
        return <li className="nav-item" key={keyName}><a href="javascript:void();" onClick={() => this.toggleTab(keyName)} className={className}><i className={icon}></i> {text}</a></li>
    }

    render() {
        if (this.props.personId === undefined || this.props.personId === null) return null;

        var tabs = [];
        var defaultTab = ''
        var currentTab = null;
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

        switch (this.state.selectedTab) {
            case 'notes': currentTab = <Notes contentType="person" contentId={this.state.personId} />; break;
            default: currentTab = null; break;
        }

        return (
            <Fragment>
                <ul className="nav nav-tabs">{tabs}</ul>
                {currentTab}
            </Fragment>
        );
    }
}

export default Tabs;