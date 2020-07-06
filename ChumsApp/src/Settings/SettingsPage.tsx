import React from 'react';
import { DisplayBox, UserHelper, BigLinkButton } from './Components';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const SettingsPage = () => {

    const getLinks = () => {
        var result = [];
        if (UserHelper.checkAccess('Admin', 'Import')) result.push(<BigLinkButton href="/settings/import" icon="fas fa-upload" text="Import Data" />);
        if (UserHelper.checkAccess('Admin', 'Import')) result.push(<BigLinkButton href="/settings/export" icon="fas fa-download" text="Export Data" />);
        if (UserHelper.checkAccess('Roles', 'View')) result.push(<BigLinkButton href="/settings/roles" icon="fas fa-lock" text="Manage Permissions" />);
        return result;
    }

    return (
        <>
            <h1><i className="fas fa-cog"></i> Settings</h1>
            <Row className="justify-content-md-center">
                {getLinks()}
            </Row>
        </>
    );
}

