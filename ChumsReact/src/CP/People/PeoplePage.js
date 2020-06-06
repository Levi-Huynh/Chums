import React from 'react';
import UserContext from '../../UserContext'
import PeopleSearchResults from './Components/PeopleSearchResults';
import ApiHelper from '../../Utils/ApiHelper';

class Login extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = { searchText: '', errors: [] };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
    }

    handleSubmit(event) {
        event.preventDefault();
        ApiHelper.apiGet('/people/search?term=' + escape(this.state.searchText))
            .then(data => this.setState({ searchResults: data }));
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })


    render() {
        return (
            <form method="post" onSubmit={this.handleSubmit}>
                <h1><i className="fas fa-user"></i> People</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="inputBox">
                            <div className="header"><i className="fas fa-user"></i> Search</div>
                            <div className="content">
                                <div className="row">
                                    <div className="col-10"><input name="searchText" type="text" placeholder="Name" className="form-control" value={this.state.searchText} onChange={this.onChange} /></div>
                                    <div className="col-2"><input type="submit" className="btn btn-primary" val="Search" /></div>
                                </div>
                                <br />
                                <PeopleSearchResults people={this.state.searchResults} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );

    }
}

export default Login;