import React from 'react';
import { InputBox, ApiHelper, RegisterInterface, UserHelper } from './';
import UserContext from '../UserContext'
import { Redirect } from 'react-router-dom';
import { ErrorMessages } from './ErrorMessages';

export const Register: React.FC = () => {

    const [register, setRegister] = React.useState<RegisterInterface>({ churchName: '', firstName: '', lastName: '', password: '', email: '' });
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState<string[]>([]);

    const context = React.useContext(UserContext);

    const validateEmail = (email: string) => { return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)); }

    const validate = () => {
        var errors: string[] = [];
        if (register.churchName === '') errors.push('Please enter your church name.')
        if (register.firstName === '') errors.push('Please enter your first name.')
        if (register.lastName === '') errors.push('Please enter your last name.')
        if (register.password === '') errors.push('Please enter a password.');
        else if (register.password.length < 6) errors.push('Passwords must be at least 6 characters.');
        if (register.email === '') errors.push('Please enter your email address.');
        else if (!validateEmail(register.email)) errors.push('Please enter a valid email address');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSave = () => {
        if (!processing) {
            if (validate()) {
                setProcessing(true);
                ApiHelper.apiPostAnonymous('/users/register', register)
                    .then((data) => {
                        ApiHelper.apiKey = data.apiToken;
                        UserHelper.populate(data.mappings).then(d => { ApiHelper.apiKey = data.apiToken; context.setUserName(data.name); });
                        document.cookie = "apiKey=" + data.apiToken;
                        setProcessing(false);
                    }).catch(() => {
                        setErrors(['A user already exists with this email address.  Please log in instead.']);
                        setProcessing(false);
                    });
            }
        }
    }

    const getProcessing = () => {
        if (!processing) return null;
        else return <div className="alert alert-info" role="alert"><b>Registering...</b> Please wait.  This will take a few seconds.</div>
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        var r = { ...register };
        switch (e.currentTarget.name) {
            case 'churchName': r.churchName = val; break;
            case 'firstName': r.firstName = val; break;
            case 'lastName': r.lastName = val; break;
            case 'email': r.email = val; break;
            case 'password': r.password = val; break;
        }
        setRegister(r);
    }

    if (context.userName === '' || ApiHelper.apiKey === '') {
        return (
            <InputBox headerIcon="" headerText="Register" saveFunction={handleSave} saveText="Register" >
                {getProcessing()}
                <ErrorMessages errors={errors} />
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Church Name" name="churchName" value={register.churchName} onChange={handleChange} />
                </div>
                <div className="row">
                    <div className="col"><div className="form-group">
                        <input type="text" className="form-control" placeholder="First Name" name="firstName" value={register.firstName} onChange={handleChange} />
                    </div></div>
                    <div className="col"><div className="form-group">
                        <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={register.lastName} onChange={handleChange} />
                    </div></div>
                </div>
                <div className="row">
                    <div className="col"><div className="form-group">
                        <input type="text" className="form-control" placeholder="Email" name="email" value={register.email} onChange={handleChange} />
                    </div></div>
                    <div className="col"><div className="form-group">
                        <input type="password" className="form-control" placeholder="Password" name="password" value={register.password} onChange={handleChange} />
                    </div></div>
                </div>
            </InputBox>
        );
    } else return <Redirect to="/cp" />
}
