import React from 'react';
import './Login.css';
import ErrorMessages from './Components/ErrorMessages';
import UserContext from '../UserContext'
import { Redirect } from 'react-router-dom';
import ApiHelper from '../Utils/ApiHelper';
import UserHelper from '../Utils/UserHelper';

class Login extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = { email: '', password: '', errors: [] };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //const user = this.context
        //console.log(user)
    }


    onChange = e => this.setState({ [e.target.name]: e.target.value })

    handleSubmit(event) {
        event.preventDefault();



        if (this.validate()) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email: this.state.email, Password: this.state.password })
            };
            fetch('https://mus2ockmn2.execute-api.us-east-2.amazonaws.com/Stage/users/login', requestOptions)
                .then(response => response.json())
                .then(data => {
                    ApiHelper.apiKey = data.apiToken;
                    UserHelper.populate(data.mappings).then(data => {
                        const newUser = { apiKey: data.apiToken, name: data.name }
                        this.context.setUser(newUser)
                    });
                });
            /*.catch(error => {
                var errors = [];
                errors.push(error.message);
                this.setState({ errors: errors });
            });*/
        }
    }

    validate() {
        var errors = [];
        if (this.state.email === '') errors.push('Please enter your email address.');
        if (this.state.password === '') errors.push('Please enter your password.');
        this.setState({ errors: errors });
        return this.state.errors.length === 0;
    }

    render() {
        const user = this.context.user


        if (user.apiKey === '') {
            console.log(user)
            return (
                <form onSubmit={this.handleSubmit}>

                    <div>{user.apiKey}</div>
                    <div className="smallCenterBlock">

                        <ErrorMessages errors={this.state.errors} />
                        <div id="loginBox">
                            <h2>Please sign in</h2>
                            <input name="email" type="text" className="form-control" value={this.state.email} onChange={this.onChange} placeholder="Email address" />
                            <input name="password" type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.onChange} />
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
        } else {
            return <Redirect to="/cp" user ></Redirect>
        }
    }
}

export default Login;