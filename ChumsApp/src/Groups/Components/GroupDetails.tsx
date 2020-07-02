import React from 'react';
import { GroupInterface, DisplayBox, GroupDetailsEdit, ServiceTimes, UserHelper } from './';
import { Row, Col } from 'react-bootstrap';

interface Props { group: GroupInterface }

export const GroupDetails: React.FC<Props> = (props) => {

    const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
    const [mode, setMode] = React.useState("display");

    const handleEdit = () => setMode('edit');
    const handleUpdated = (g: GroupInterface) => { setMode('display'); setGroup(g); }
    const getEditFunction = () => { return (UserHelper.checkAccess('Groups', 'Edit')) ? handleEdit : null }

    React.useEffect(() => { setGroup(props.group) }, [props.group]);

    if (mode === 'edit') return <GroupDetailsEdit group={group} updatedFunction={handleUpdated} />
    else return (
        <DisplayBox headerText="Group Details" headerIcon="fas fa-list" editFunction={getEditFunction()} >
            <Row>
                <Col><label>Category:</label> {group.categoryName}</Col>
                <Col><label>Name:</label> {group.name}</Col>
            </Row>
            <Row>
                <Col lg={6}><label>Track Attendance:</label> {(group.trackAttendance?.toString().replace('false', 'No').replace('true', 'Yes') || '')}</Col>
            </Row>
            <ServiceTimes group={group} />
        </DisplayBox>
    );
}

