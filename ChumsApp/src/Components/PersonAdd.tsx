import React from 'react';
import { ApiHelper, PersonInterface, PersonHelper } from './';
import { Table, Button, FormControl, InputGroup } from 'react-bootstrap';

interface Props { addFunction: (person: PersonInterface) => void }

export const PersonAdd: React.FC<Props> = (props) => {
    const [searchResults, setSearchResults] = React.useState(null);
    const [searchText, setSearchText] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); setSearchText(e.currentTarget.value); }
    const handleSearch = (e: React.MouseEvent) => { e.preventDefault(); ApiHelper.apiGet('/people/search?term=' + escape(searchText)).then(data => setSearchResults(data)); }
    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = anchor.getAttribute('data-index');
        var sr = searchResults;
        var person = sr.splice(idx, 1)[0];
        setSearchResults(sr);
        props.addFunction(person);
    }

    var rows = [];
    if (searchResults !== null) {
        for (var i = 0; i < searchResults.length; i++) {
            var sr = searchResults[i];
            rows.push(
                <tr key={sr.id}>
                    <td><img src={PersonHelper.getPhotoUrl(sr)} alt="avatar" /></td>
                    <td>{sr.name.display}</td>
                    <td><a href="about:blank" className="text-success" data-index={i} onClick={handleAdd}><i className="fas fa-user"></i> Add</a></td>
                </tr>
            );
        }
    }

    return (
        <>
            <InputGroup>
                <FormControl id="personAddText" value={searchText} onChange={handleChange} />
                <div className="input-group-append"><Button id="personAddButton" variant="primary" onClick={handleSearch} ><i className="fas fa-search"></i> Search</Button></div>
            </InputGroup>
            <Table size="sm" id="householdMemberAddTable"><tbody>{rows}</tbody></Table>
        </>
    );
}
