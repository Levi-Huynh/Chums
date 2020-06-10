import React from 'react';
import './Login.css';
import ErrorMessages from './Components/ErrorMessages';
import UserContext from '../UserContext'
import { Redirect } from 'react-router-dom';
import ApiHelper from '../Utils/ApiHelper';
import UserHelper from '../Utils/UserHelper';

const Login = (props) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    const getCookieValue = a => { var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)'); return b ? b.pop() : ''; }
    const validate = () => {
        var errors = [];
        if (email === '') errors.push('Please enter your email address.');
        if (password === '') errors.push('Please enter your password.');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Email: email, Password: password }) };
            fetch('https://mus2ockmn2.execute-api.us-east-2.amazonaws.com/Stage/users/login', requestOptions)
                .then(response => response.json())
                .then(data => {
                    ApiHelper.apiKey = data.apiToken;
                    UserHelper.populate(data.mappings).then(data => {
                        const newUser = { apiKey: data.apiToken, name: data.name }
                        context.setUser(newUser)
                    });
                    document.cookie = "apiKey=" + data.apiToken;
                })
                .catch(error => setErrors([error.message]));
        }
    }

    const init = () => {
        var apiKey = getCookieValue('apiKey');
        if (apiKey !== '') {
            const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resetGuid: apiKey }) };
            fetch('https://mus2ockmn2.execute-api.us-east-2.amazonaws.com/Stage/users/login', requestOptions)
                .then(response => response.json())
                .then(data => {
                    ApiHelper.apiKey = data.apiToken;
                    UserHelper.populate(data.mappings).then(data => {
                        const newUser = { apiKey: data.apiToken, name: data.name }
                        context.setUser(newUser)
                    });
                    document.cookie = "apiKey=" + data.apiToken;
                })
                .catch(error => document.cookie = '');
        }
    }

    const context = React.useContext(UserContext)
    React.useEffect(() => init(), []);

    if (context.user.apiKey === '') {
        return (
            <form onSubmit={handleSubmit}>
                <div className="smallCenterBlock">
                    <ErrorMessages errors={errors} />
                    <div id="loginBox">
                        <h2>Please sign in</h2>
                        <input name="email" type="text" className="form-control" value={email} onChange={e => { e.preventDefault(); setEmail(e.target.value) }} placeholder="Email address" />
                        <input name="password" type="password" className="form-control" placeholder="Password" value={password} onChange={e => { e.preventDefault(); setPassword(e.target.value) }} />
                        <input type="submit" value="Sign in" className="btn btn-lg btn-primary btn-block" />
                        <br />
                        <div className="text-right">
                            <a href="/#register">Register</a> &nbsp; | &nbsp;
                            <a href="/cp/forgotpassword.aspx">Forgot Password</a>
                            &nbsp;
                        </div>
                    </div>
                </div>
            </form>
        );
    } else return <Redirect to="/cp" />

}

export default Login;