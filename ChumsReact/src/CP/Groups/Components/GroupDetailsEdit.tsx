import React from 'react';
import { ApiHelper, GroupInterface, InputBox, ErrorMessages, ServiceTimesEdit } from './';
import { Redirect } from 'react-router-dom';

interface Props {
    group: GroupInterface,
    updatedFunction: (group: GroupInterface) => void
}

export const GroupDetailsEdit: React.FC<Props> = (props) => {

    const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
    const [mode, setMode] = React.useState("display");
    const [errors, setErrors] = React.useState([]);
    const [redirect, setRedirect] = React.useState('');

    const handleCancel = () => props.updatedFunction(group);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        var g = { ...group };
        switch (e.target.name) {
            case 'categoryName': g.categoryName = e.target.value; break;
            case 'name': g.name = e.target.value; break;
            case 'trackAttendance': g.trackAttendance = (e.target.value === 'true'); break;
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
                var g = { ...group };
                g.id = parseInt(data);
                setGroup(g);
                props.updatedFunction(g);
            });
        }
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to permanently delete this group?')) {
            ApiHelper.apiDelete('/groups/' + group.id.toString()).then(() => setRedirect('/cp/groups'));
        }
    }

    React.useEffect(() => { setGroup(props.group) }, [props.group]);



    if (redirect !== '') return <Redirect to={redirect} />
    else return (
        <InputBox headerText="Group Details" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete} >
            <ErrorMessages errors={errors} />
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label>Category Name</label>
                        <input type="text" className="form-control" name="categoryName" value={group.categoryName} onChange={handleChange} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>Group Name</label>
                        <input type="text" className="form-control" name="name" value={group.name} onChange={handleChange} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label>Track Attendance</label>
                        <select className="form-control" name="trackAttendance" value={group.trackAttendance?.toString() || 'false'} onChange={handleChange}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </div>
            </div>
            <ServiceTimesEdit group={group} />

        </InputBox>
    );
}

