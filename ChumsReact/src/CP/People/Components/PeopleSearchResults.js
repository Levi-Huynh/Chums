import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PersonHelper from '../../../Utils/PersonHelper';

function PeopleSearchResults(props) {

    if (props.people === undefined || props.people == null || props.people.length === 0) return <Fragment></Fragment>
    else {
        const items = [];
        for (var i = 0; i < props.people.length; i++) {
            var p = props.people[i];
            items.push(<tr>
                <td><img src={PersonHelper.getPhotoUrl(1, p.id, p.photoUpdated)} alt="avatar" /></td>
                <td><Link to={"/cp/people/" + p.id.toString()}>{p.displayName}</Link></td>
            </tr>);
        }
        var result =
            <Fragment>
                <table className="table" id="peopleTable">
                    <tbody>
                        <tr><th></th><th>Name</th></tr>
                        {items}
                    </tbody>
                </table>
                <hr />
                <b>Add a New Person</b>
                <div className="row">
                    <div className="col"><input type="text" className="form-control" placeholder="First Name" /></div>
                    <div className="col"><input type="text" className="form-control" placeholder="Last Name" /></div>
                    <div className="col"><input type="submit" className="btn btn-primary" value="Add" /></div>
                </div>
            </Fragment>;
        return result;
    }

}
export default PeopleSearchResults;