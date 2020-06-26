import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { PersonHelper, ErrorMessages, ApiHelper, PersonInterface, HouseholdInterface } from '.';
import { UserHelper } from '../../../Utils';

interface Props {
    people: PersonInterface[]
}

export const PeopleSearchResults: React.FC<Props> = (props) => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [redirectUrl, setRedirectUrl] = React.useState('');
    const [errors, setErrors] = React.useState<string[]>([]);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (validate()) {
            ApiHelper.apiGet('/campuses').then(data => {
                var campusId = data[0].id;
                var person = { firstName: firstName, lastName: lastName, campuseId: campusId } as PersonInterface;
                var household = { name: lastName } as HouseholdInterface;
                var promises = [];
                promises.push(ApiHelper.apiPost('/people', [person]).then(data => person.id = data[0]));
                promises.push(ApiHelper.apiPost('/households', [household]).then(data => household.id = data[0]));
                Promise.all(promises).then(() => {
                    var householdMember = { householdId: household.id, personId: person.id, role: 'Head' };
                    ApiHelper.apiPost('/householdmembers/' + household.id, [householdMember]).then(() => setRedirectUrl('/cp/people/' + person.id));
                });
            });
        }
    }

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
                <td><img src={PersonHelper.getPhotoUrl(p.id, p.photoUpdated)} alt="avatar" /></td>
                <td><Link to={"/cp/people/" + p.id.toString()}>{p.displayName}</Link></td>
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
                <div className="row">
                    <div className="col"><input type="text" className="form-control" placeholder="First Name" name="firstName" value={firstName} onChange={e => setFirstName(e.currentTarget.value)} /></div>
                    <div className="col"><input type="text" className="form-control" placeholder="Last Name" name="lastName" value={lastName} onChange={e => setLastName(e.currentTarget.value)} /></div>
                    <div className="col"><input type="submit" className="btn btn-primary" value="Add" onClick={handleAdd} /></div>
                </div>
            </>);
    }


    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else if (props.people === undefined || props.people === null || props.people.length === 0) return <></>
    else {
        var result =
            <>
                <table className="table" id="peopleTable">
                    <tbody>
                        <tr><th></th><th>Name</th></tr>
                        {getRows()}
                    </tbody>
                </table>
                {getAddPerson()}
            </>;
        return result;
    }
}