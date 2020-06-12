import React from 'react';
import { PeopleSearchResults, ApiHelper } from './Components';

export const PeoplePage = () => {
    const [searchText, setSearchText] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

    return (
        <form method="post" onSubmit={handleSubmit}>
            <h1><i className="fas fa-user"></i> People</h1>
            <div className="row">
                <div className="col-sm-6">
                    <div className="inputBox">
                        <div className="header"><i className="fas fa-user"></i> Search</div>
                        <div className="content">
                            <div className="input-group">
                                <input name="searchText" type="text" placeholder="Name" className="form-control" value={searchText} onChange={handleChange} />
                                <div className="input-group-append">
                                    <input type="submit" className="btn btn-primary" value="Search" />
                                </div>
                            </div>

                            <br />
                            <PeopleSearchResults people={searchResults} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
