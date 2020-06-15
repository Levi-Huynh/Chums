import React from 'react';
import { ApiHelper, DisplayBox, GroupInterface, GroupAdd } from './Components';
import { Link } from 'react-router-dom';

export const GroupsPage = () => {

    const [groups, setGroups] = React.useState<GroupInterface[]>([]);
    const [showAdd, setShowAdd] = React.useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowAdd(true);
    }

    const handleAddUpdated = () => {
        setShowAdd(false);
        loadData();
    }

    const loadData = () => {
        ApiHelper.apiGet('/groups').then(data => {
            setGroups(data);
        });
    }

    React.useEffect(() => loadData(), []);

    const getRows = () => {
        var rows = [];
        var lastCat = '';
        for (var i = 0; i < groups.length; i++) {
            var g = groups[i];
            var cat = (g.categoryName != lastCat) ? <><i className="far fa-folder"></i> {g.categoryName}</> : <></>;
            var memberCount = (g.memberCount == 1) ? '1 person' : g.memberCount.toString() + ' people';
            rows.push(<tr key={g.id}>
                <td>{cat}</td>
                <td><i className="fas fa-list"></i> <Link to={"/cp/groups/" + g.id.toString()}>{g.name}</Link></td>
                <td>{memberCount}</td>
            </tr>);
            lastCat = g.categoryName;
        }
        return rows
    }



    var addBox = (showAdd) ? <GroupAdd updatedFunction={handleAddUpdated} /> : <></>

    return (
        <form method="post">
            <h1><i className="fas fa-list"></i> Groups</h1>
            <div className="row">
                <div className="col-lg-8">
                    <DisplayBox headerIcon="fas fa-list" headerText="Groups">
                        <table className="table">
                            <tbody>
                                <tr><th>Category</th><th>Name</th><th>People</th></tr>
                                {getRows()}
                                <tr><td><a href="#" onClick={handleAdd} className="text-success" ><i className="fas fa-list"></i> Add Group</a></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    </DisplayBox>
                </div>
                <div className="col-lg-4">
                    {addBox}
                </div>
            </div>
        </form >
    );
}
