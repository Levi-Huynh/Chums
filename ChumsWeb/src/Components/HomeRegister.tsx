import React from 'react';
import { ApiHelper, RegisterInterface } from '.';
import { ErrorMessages } from './ErrorMessages';
import { Row, Col, Container, Button } from 'react-bootstrap'

export const HomeRegister: React.FC = () => {

    const [register, setRegister] = React.useState<RegisterInterface>({ churchName: '', firstName: '', lastName: '', password: '', email: '' });
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [redirectUrl, setRedirectUrl] = React.useState('');

    //const validateEmail = (email: string) => { return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)); }
    //const validateEmail = (email: string) => { return (/^\w+([\.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)); }
    const validateEmail = (email: string) => { return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)); }

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
                        setRedirectUrl('https://app.chums.org/login?guid=' + data.apiToken);
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

    if (redirectUrl === '') {
        return (
            <div className="homeSection" id="registerSection">
                <Container>
                    <div id="register"></div>

                    <Row>
                        <Col lg={6} className="d-none d-lg-block" ><img src="/images/home/register.png" alt="register" className="img-fluid" /></Col>
                        <Col lg={6}>
                            <div className="title"><span>Join CHUMS</span></div>
                            <h2>Register for a Free Account</h2>
                            <p>You'll be up and running in less than a minute.</p>

                            {getProcessing()}
                            <ErrorMessages errors={errors} />
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Church Name" name="churchName" value={register.churchName} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="First Name" name="firstName" value={register.firstName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={register.lastName} onChange={handleChange} />
                            </div>


                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Email" name="email" value={register.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="Password" name="password" value={register.password} onChange={handleChange} />
                            </div>
                            <Button variant="success" block onClick={(e: React.MouseEvent) => { e.preventDefault(); handleSave(); }}>Get Started for Free</Button>


                        </Col>
                    </Row>
                </Container>
            </div >
        );
    } else {
        window.location.href = redirectUrl;
        return (<></>);
    }
}
