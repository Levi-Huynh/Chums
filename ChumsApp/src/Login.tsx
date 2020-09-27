import React from 'react';
import './Login.css';
import { ErrorMessages, ApiHelper, UserHelper, EnvironmentHelper, LoginResponseInterface } from './Components';
import UserContext from './UserContext'
import { Button, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';


export const Login: React.FC = (props: any) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(null); } }
    const getCookieValue = (a: string) => { var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)'); return b ? b.pop() : ''; }
    const validate = () => {
        var errors = [];
        if (email === '') errors.push('Please enter your email address.');
        if (password === '') errors.push('Please enter your password.');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = (e: React.MouseEvent) => {
        if (e !== null) e.preventDefault();
        if (validate()) login({ email: email, password: password });
    }

    const init = () => {
        let search = new URLSearchParams(props.location.search);
        console.log(document.cookie);
        var jwt = search.get('jwt') || getCookieValue('jwt');
        if (jwt !== "undefined" && jwt !== '') login({ jwt: jwt });
    }

    const login = (data: {}) => {
        ApiHelper.apiPostAnonymous(EnvironmentHelper.AccessManagementApiUrl + '/users/login', data).then((resp: LoginResponseInterface) => {
            document.cookie = "jwt=" + resp.token;
            ApiHelper.jwt = resp.token;
            ApiHelper.amJwt = resp.token;
            UserHelper.user = resp.user;
            UserHelper.churches = [];
            resp.churches.forEach(c => {
                var add = false;
                c.apps.forEach(a => {
                    if (a.name === "CHUMS") add = true;
                })
                if (add) UserHelper.churches.push(c);
            });
            selectChurch();
        }).catch((e) => {
            throw e;
            //window.location.href = '/';
        });

    }


    const selectChurch = () => {
        UserHelper.selectChurch(UserHelper.churches[0].id, context);
        console.log(ApiHelper.jwt);
    }

    const context = React.useContext(UserContext)
    React.useEffect(init, []);

    if (context.userName === '' || ApiHelper.jwt === '') {
        return (

            <div className="smallCenterBlock">
                <img src="/images/logo-login.png" alt="logo" className="img-fluid" style={{ marginBottom: 50 }} />
                <ErrorMessages errors={errors} />
                <div id="loginBox">
                    <h2>Please sign in</h2>
                    <FormControl id="email" name="email" value={email} onChange={e => { e.preventDefault(); setEmail(e.currentTarget.value) }} placeholder="Email address" onKeyDown={handleKeyDown} />
                    <FormControl id="password" name="password" type="password" placeholder="Password" value={password} onChange={e => { e.preventDefault(); setPassword(e.currentTarget.value) }} onKeyDown={handleKeyDown} />
                    <Button id="signInButton" size="lg" variant="primary" block onClick={handleSubmit} >Sign in</Button>
                    <br />
                    <div className="text-right">
                        <a href="/forgot">Forgot Password</a>&nbsp;
                    </div>
                </div>
            </div>

        );
    } else return <Redirect to="/cp" />

}