import React from 'react';
import { Person, Groups, Tabs, Household } from './Components'
import { ApiHelper } from '../../Utils/ApiHelper';


import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const PersonPage = ({ match }: RouteComponentProps<TParams>) => {

    const [person, setPerson] = React.useState(null);

    React.useEffect(() => loadData(), [match.params.id]);

    const loadData = () => {
        ApiHelper.apiGet('/people/' + match.params.id)
            .then(data => setPerson(data));
    }

    return (
        <div className="row">
            <div className="col-md-8">
                <Person person={person} />
                <Tabs personId={person?.id} />
            </div >
            <div className="col-md-4">
                <Household personId={person?.id} />
                <Groups personId={person?.id} />
            </div>
        </div >
    )

}
