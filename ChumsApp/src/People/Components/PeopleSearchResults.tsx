import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { PersonHelper, ErrorMessages, ApiHelper, PersonInterface, HouseholdInterface, UserHelper } from '.';
import { Row, Col, FormControl, Button, Table } from 'react-bootstrap';

interface Props {
    people: PersonInterface[]
}

export const PeopleSearchResults: React.FC<Props> = (props) => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [redirectUrl, setRedirectUrl] = React.useState('');
    const [errors, setErrors] = React.useState<string[]>([]);

    const handleAdd = (e: React.MouseEvent) => {
        if (e !== null) e.preventDefault();
        if (validate()) {
            var person = { name: { first: firstName, last: lastName } } as PersonInterface;
            var household = { name: lastName } as HouseholdInterface;
            ApiHelper.apiPost('/households', [household]).then(data => {
                household.id = data[0].id;
                person.householdId = household.id;
                ApiHelper.apiPost('/people', [person]).then(data => {
                    person.id = data[0].id
                    setRedirectUrl('/people/' + person.id);
                });
            });
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(null); } }

    const validate = () => {
        var errors = []
        if (firstName.trim() === '') errors.push('First name cannot be blank.');
        if (lastName.trim() === '') errors.push('Last name cannot be blank.');
        setErrors(errors);
        return errors.length === 0;
    }

    const getRows = () => {
        var result = [];
        for (var i = 0; i < props.people.length; i++) {
            var p = props.people[i];
            result.push(<tr key={p.id}>
                <td><img src={PersonHelper.getPhotoUrl(p)} alt="avatar" /></td>
                <td><Link to={"/people/" + p.id.toString()}>{p.name.display}</Link></td>
            </tr>);
        }
        return result;
    }
    const getAddPerson = () => {
        if (!UserHelper.checkAccess('People', 'Edit')) return (<></>);
        else return (
            <>
                <hr />
                <ErrorMessages errors={errors} />
                <b>Add a New Person</b>
                <Row>
                    <Col><FormControl placeholder="First Name" name="firstName" value={firstName} onChange={e => setFirstName(e.currentTarget.value)} onKeyDown={handleKeyDown} /></Col>
                    <Col><FormControl placeholder="Last Name" name="lastName" value={lastName} onChange={e => setLastName(e.currentTarget.value)} onKeyDown={handleKeyDown} /></Col>
                    <Col><Button variant="primary" onClick={handleAdd} >Add</Button></Col>
                </Row>
            </>);
    }


    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else if (props.people === undefined || props.people === null) return (<div className="alert alert-info">Use the search box above to search for a member or add a new one.</div>)
    else if (props.people.length === 0) return (<>
        <p>No results found.  Please search for a different name or add a new person</p>
        {getAddPerson()}
    </>);
    else {
        var result =
            <>
                <Table id="peopleTable">
                    <thead><tr><th></th><th>Name</th></tr></thead>
                    <tbody>{getRows()}</tbody>
                </Table>
                {getAddPerson()}
            </>;
        return result;
    }
}