import React from 'react';
import UserContext from '../../UserContext'
import PeopleSearchResults from './Components/PeopleSearchResults';
import ApiHelper from '../../Utils/ApiHelper';


const PeoplePage = (props) => {
    const [searchText, setSearchText] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data));
    }

    const handleChange = e => setSearchText(e.target.value);

    return (
        <form method="post" onSubmit={handleSubmit}>
            <h1><i className="fas fa-user"></i> People</h1>
            <div className="row">
                <div className="col-sm-6">
                    <div className="inputBox">
                        <div className="header"><i className="fas fa-user"></i> Search</div>
                        <div className="content">
                            <div className="row">
                                <div className="col-10"><input name="searchText" type="text" placeholder="Name" className="form-control" value={searchText} onChange={handleChange} /></div>
                                <div className="col-2"><input type="submit" className="btn btn-primary" val="Search" /></div>
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

export default PeoplePage;
