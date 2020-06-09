import React, { Fragment } from 'react';
import ApiHelper from '../../Utils/ApiHelper';
import PersonHelper from "../../Utils/PersonHelper";

class PersonAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = { searchResults: null, searchText: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ searchText: e.target.value });
    }

    handleSearch(e) {
        e.preventDefault();
        ApiHelper.apiGet('/people/search?term=' + escape(this.state.searchText)).then(data => this.setState({ searchResults: data }));
    }

    handleAdd(e) {
        e.preventDefault();
        var idx = e.target.getAttribute('data-index');
        var searchResults = this.state.searchResults;
        var person = searchResults.splice(idx, 1)[0];
        this.setState({ searchResults: searchResults });
        this.props.addFunction(person);
    }

    render() {
        var rows = [];
        if (this.state.searchResults !== null) {
            for (var i = 0; i < this.state.searchResults.length; i++) {
                var sr = this.state.searchResults[i];
                rows.push(
                    <tr key={sr.id}>
                        <td><img src={PersonHelper.getPhotoUrl(sr.d, sr.photoUpdated)} alt="avatar" /></td>
                        <td>{sr.displayName}</td>
                        <td><a href="#" className="text-success" data-index={i} onClick={this.handleAdd}><i class="fas fa-user"></i> Add</a></td>
                    </tr>
                );
            }
        }

        return (
            <Fragment>
                <div class="input-group">
                    <input type="text" className="form-control" value={this.state.searchText} onChange={this.handleChange} />
                    <div class="input-group-append"><a href="#" className="btn btn-primary" onClick={this.handleSearch} ><i class="fas fa-search"></i> Search</a></div>
                </div>
                <table class="table table-sm" id="householdMemberAddTable">
                    <tbody>{rows}</tbody>
                </table>
            </Fragment>
        );

    }
}

export default PersonAdd;