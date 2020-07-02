import React from 'react';
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink } from './Components';
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';

export const PeoplePage = () => {
    const [searchText, setSearchText] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

    const getEditContent = () => { return (<ExportLink data={searchResults} filename="people.csv" />); }

    return (
        <>
            <h1><i className="fas fa-user"></i> People</h1>
            <Row>
                <Col lg={6}>
                    <DisplayBox headerIcon="fas fa-user" headerText="Search" editContent={getEditContent()} >
                        <InputGroup>
                            <FormControl name="searchText" type="text" placeholder="Name" value={searchText} onChange={handleChange} />
                            <InputGroup.Append><Button variant="primary" onClick={handleSubmit}>Search</Button></InputGroup.Append>
                        </InputGroup>
                        <br />
                        <PeopleSearchResults people={searchResults} />
                    </DisplayBox>
                </Col>
            </Row>
        </>
    );
}
