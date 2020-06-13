import React from 'react';
import { ApiHelper, DisplayBox, GroupInterface, GroupDetails, PersonAdd, PersonInterface, Tabs } from './Components';
import { Link, RouteComponentProps } from 'react-router-dom';

type TParams = { id?: string };

export const GroupPage = ({ match }: RouteComponentProps<TParams>) => {

    const [group, setGroup] = React.useState({} as GroupInterface);
    const [addedPerson, setAddedPerson] = React.useState({} as PersonInterface);
    //*** Is there a better way to pass this data from PersonAdd to GroupMembers than PersonAdd -> PersonPage -> Tabs -> GroupMembers?
    const addPerson = (p: PersonInterface) => setAddedPerson(p);
    const loadData = () => { ApiHelper.apiGet('/groups/' + match.params.id).then(data => setGroup(data)); }
    React.useEffect(() => loadData(), []);


    return (
        <form method="post">
            <h1><i className="fas fa-list"></i> {group.name}</h1>
            <div className="row">
                <div className="col-lg-8">
                    <GroupDetails group={group} />
                    <Tabs group={group} addedPerson={addedPerson} />
                </div>
                <div className="col-lg-4">
                    <DisplayBox headerIcon="fas fa-user" headerText="Add Person">
                        <PersonAdd addFunction={addPerson} />
                    </DisplayBox>

                </div>
            </div>

        </form >
    );
}
