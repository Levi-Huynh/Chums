import React, { ChangeEvent } from 'react';
import { CampusInterface, InputBox, ErrorMessages, ApiHelper } from './';

interface Props { campus: CampusInterface, updatedFunction: () => void }

export const CampusEdit: React.FC<Props> = (props) => {
    const [campus, setCampus] = React.useState({} as CampusInterface);
    const [errors, setErrors] = React.useState([]);

    const handleSave = () => { if (validate()) ApiHelper.apiPost('/campuses', [campus]).then(props.updatedFunction); }
    const handleDelete = () => { if (window.confirm('Are you sure you wish to permanently delete this campus?')) ApiHelper.apiDelete('/campus/' + campus.id).then(props.updatedFunction); }

    const validate = () => {
        var errors = [];
        if (campus.name === '') errors.push("Campus name cannot be blank.");
        setErrors(errors);
        return errors.length === 0;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        var c = { ...campus };
        c.name = e.currentTarget.value;
        setCampus(c);
    }

    React.useEffect(() => setCampus(props.campus), [props.campus]);

    if (campus === null || campus.id === undefined) return null;

    return (
        <InputBox cancelFunction={props.updatedFunction} saveFunction={handleSave} deleteFunction={handleDelete} headerText={campus.name} headerIcon="fas fa-church" >
            <ErrorMessages errors={errors} />
            <div className="form-group">
                <label>Campus Name</label>
                <input type="text" className="form-control" value={campus?.name || ''} onChange={handleChange} />
            </div>
        </InputBox>
    );
}