import React from 'react';
import './Login.css';
import { ErrorMessages, ApiHelper, UserHelper } from './Components';
import UserContext from '../UserContext'
import { Redirect } from 'react-router-dom';

interface LoginResponse { apiToken: string, name: string }


export const Login: React.FC = (props: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    const getCookieValue = (a: string) => { var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)'); return b ? b.pop() : ''; }
    const validate = () => {
        var errors = [];
        if (email === '') errors.push('Please enter your email address.');
        if (password === '') errors.push('Please enter your password.');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) login({ Email: email, Password: password });
    }

    const init = () => {
        let search = new URLSearchParams(props.location.search);
        var apiKey = search.get('guid') || getCookieValue('apiKey');
        if (apiKey !== '') login({ resetGuid: apiKey });
    }

    const login = (data: {}) => {
        const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        fetch(ApiHelper.baseUrl + '/users/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                ApiHelper.apiKey = data.apiToken;
                UserHelper.populate(data.mappings).then(d => { ApiHelper.apiKey = data.apiToken; context.setUserName(data.name); });
                document.cookie = "apiKey=" + data.apiToken;
            })
            .catch(error => document.cookie = '');
    }

    const context = React.useContext(UserContext)
    React.useEffect(init, []);

    if (context.userName === '' || ApiHelper.apiKey === '') {
        return (
            <form onSubmit={handleSubmit}>
                <div className="smallCenterBlock">
                    <ErrorMessages errors={errors} />
                    <div id="loginBox">
                        <h2>Please sign in</h2>
                        <input name="email" type="text" className="form-control" value={email} onChange={e => { e.preventDefault(); setEmail(e.currentTarget.value) }} placeholder="Email address" />
                        <input name="password" type="password" className="form-control" placeholder="Password" value={password} onChange={e => { e.preventDefault(); setPassword(e.currentTarget.value) }} />
                        <input type="submit" value="Sign in" className="btn btn-lg btn-primary btn-block" />
                        <br />
                        <div className="text-right">
                            <a href="/#register">Register</a> &nbsp; | &nbsp;
                            <a href="/cp/forgot">Forgot Password</a>
                            &nbsp;
                        </div>
                    </div>
                </div>
            </form>
        );
    } else return <Redirect to="/cp" />

}