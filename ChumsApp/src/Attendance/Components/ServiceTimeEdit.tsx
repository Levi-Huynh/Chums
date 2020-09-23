import React, { ChangeEvent } from 'react';
import { ServiceTimeInterface, ServiceInterface, InputBox, ErrorMessages, ApiHelper } from './';

interface Props {
    serviceTime: ServiceTimeInterface,
    updatedFunction: () => void
}

export const ServiceTimeEdit: React.FC<Props> = (props) => {
    const [serviceTime, setServiceTime] = React.useState({} as ServiceTimeInterface);
    const [services, setServices] = React.useState([] as ServiceInterface[]);
    const [errors, setErrors] = React.useState([]);

    const handleSave = () => { if (validate()) ApiHelper.apiPost('/servicetimes', [serviceTime]).then(props.updatedFunction); }
    const handleDelete = () => { if (window.confirm('Are you sure you wish to permanently delete this service time?')) ApiHelper.apiDelete('/servicetimes/' + serviceTime.id).then(props.updatedFunction); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }
    const loadData = React.useCallback(() => {
        ApiHelper.apiGet('/services').then(data => {
            setServices(data);
            if (data.length > 0) {
                var st = { ...props.serviceTime };
                st.serviceId = data[0].id;
                setServiceTime(st);
            }
        });
    }, [props.serviceTime]);

    const validate = () => {
        var errors = [];
        if (serviceTime.name === '') errors.push("Service time name cannot be blank.");
        setErrors(errors);
        return errors.length === 0;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        var st = { ...serviceTime };
        switch (e.currentTarget.name) {
            case 'serviceTimeName': st.name = e.currentTarget.value; break;
            case 'campus': st.serviceId = parseInt(e.currentTarget.value); break;
        }
        setServiceTime(st);
    }



    const getServiceOptions = () => {
        var options = [];
        for (var i = 0; i < services.length; i++) options.push(<option value={services[i].id}>{services[i].name}</option>);
        return options;
    }


    React.useEffect(() => { setServiceTime(props.serviceTime); loadData(); }, [props.serviceTime, loadData]);

    if (serviceTime === null || serviceTime.id === undefined) return null;

    return (
        <InputBox id="serviceTimeBox" cancelFunction={props.updatedFunction} saveFunction={handleSave} deleteFunction={handleDelete} headerText={serviceTime.name} headerIcon="far fa-clock" >
            <ErrorMessages errors={errors} />
            <div className="form-group">
                <label>Service</label>
                <select name="service" className="form-control" value={serviceTime?.serviceId || 0} onChange={handleChange} onKeyDown={handleKeyDown}>{getServiceOptions()}</select>
            </div>
            <div className="form-group">
                <label>Service Time Name</label>
                <input name="serviceTimeName" type="text" className="form-control" value={serviceTime?.name || ''} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
        </InputBox>
    );
}