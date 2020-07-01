import React, { ChangeEvent } from 'react';
import { ServiceInterface, InputBox, ErrorMessages, ApiHelper, CampusInterface } from './';

interface Props {
    service: ServiceInterface,
    updatedFunction: () => void
}

export const ServiceEdit: React.FC<Props> = (props) => {
    const [service, setService] = React.useState({} as ServiceInterface);
    const [campuses, setCampuses] = React.useState([] as CampusInterface[]);
    const [errors, setErrors] = React.useState([]);

    const handleSave = () => { if (validate()) ApiHelper.apiPost('/services', [service]).then(props.updatedFunction); }
    const handleDelete = () => { if (window.confirm('Are you sure you wish to permanently delete this service?')) ApiHelper.apiDelete('/services/' + service.id).then(props.updatedFunction); }
    const loadData = () => ApiHelper.apiGet('/campuses').then(data => {
        setCampuses(data);
        if (data.length > 0) {
            var s = { ...props.service };
            s.campusId = data[0].id;
            setService(s);
        }
    });

    const validate = () => {
        var errors = [];
        if (service.name === '') errors.push("Service name cannot be blank.");
        setErrors(errors);
        return errors.length === 0;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        var s = { ...service };
        switch (e.currentTarget.name) {
            case 'serviceName': s.name = e.currentTarget.value; break;
            case 'campus': s.campusId = parseInt(e.currentTarget.value); break;
        }
        setService(s);
    }

    const getCampusOptions = () => {
        var options = [];
        for (var i = 0; i < campuses.length; i++) options.push(<option value={campuses[i].id}>{campuses[i].name}</option>);
        return options;
    }

    React.useEffect(() => { setService(props.service); loadData(); }, [props.service]);


    if (service === null || service.id === undefined) return null;

    return (
        <InputBox cancelFunction={props.updatedFunction} saveFunction={handleSave} deleteFunction={handleDelete} headerText={service.name} headerIcon="far fa-calendar-alt" >
            <ErrorMessages errors={errors} />
            <div className="form-group">
                <label>Campus</label>
                <select name="campus" className="form-control" value={service?.campusId || 0} onChange={handleChange}>{getCampusOptions()}</select>
            </div>
            <div className="form-group">
                <label>Service Name</label>
                <input name="serviceName" type="text" className="form-control" value={service?.name || ''} onChange={handleChange} />
            </div>
        </InputBox>
    );
}