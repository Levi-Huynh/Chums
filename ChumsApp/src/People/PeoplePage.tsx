import React from 'react';
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink } from './Components';


export const PeoplePage = () => {
    const [searchText, setSearchText] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

    const getEditContent = () => {
        return (<ExportLink data={searchResults} />);
    }

    return (
        <>
            <h1><i className="fas fa-user"></i> People</h1>
            <div className="row">
                <div className="col-sm-6">
                    <DisplayBox headerIcon="fas fa-user" headerText="Search" editContent={getEditContent()} >
                        <div className="input-group">
                            <input name="searchText" type="text" placeholder="Name" className="form-control" value={searchText} onChange={handleChange} />
                            <div className="input-group-append">
                                <input type="submit" className="btn btn-primary" value="Search" onClick={handleSubmit} />
                            </div>
                        </div>

                        <br />
                        <PeopleSearchResults people={searchResults} />
                    </DisplayBox>

                </div>
            </div>
        </>
    );
}
