import React from 'react';
import { ApiHelper, GroupInterface, InputBox, ErrorMessages, ServiceTimesEdit } from './';
import { Redirect } from 'react-router-dom';
import { Row, Col, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetailsEdit: React.FC<Props> = (props) => {
    const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
    const [errors, setErrors] = React.useState([]);
    const [redirect, setRedirect] = React.useState('');

    const handleCancel = () => props.updatedFunction(group);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        var g = { ...group };
        switch (e.currentTarget.name) {
            case 'categoryName': g.categoryName = e.currentTarget.value; break;
            case 'name': g.name = e.currentTarget.value; break;
            case 'trackAttendance': g.trackAttendance = (e.currentTarget.value === 'true'); break;
        }
        setGroup(g);
    }

    const validate = () => {
        var errors = [];
        if (group.categoryName === '') errors.push('Please enter a category name.');
        if (group.name === '') errors.push('Please enter a group name.');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSave = () => {
        if (validate()) {
            ApiHelper.apiPost('/groups', [group]).then(data => {
                setGroup(data);
                props.updatedFunction(data);
            });
        }
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to permanently delete this group?')) {
            ApiHelper.apiDelete('/groups/' + group.id.toString()).then(() => setRedirect('/groups'));
        }
    }

    React.useEffect(() => { setGroup(props.group) }, [props.group]);



    if (redirect !== '') return <Redirect to={redirect} />
    else return (
        <InputBox id="groupDetailsBox" headerText="Group Details" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
            <ErrorMessages errors={errors} />
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl type="text" name="categoryName" value={group.categoryName} onChange={handleChange} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <FormLabel>Group Name</FormLabel>
                        <FormControl type="text" name="name" value={group.name} onChange={handleChange} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Track Attendance</FormLabel>
                        <FormControl as="select" name="trackAttendance" value={group.trackAttendance?.toString() || 'false'} onChange={handleChange}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
            <ServiceTimesEdit group={group} />

        </InputBox>
    );
}

