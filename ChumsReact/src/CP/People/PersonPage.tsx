import React from 'react';
import { Person } from './Components/Person'
import { Groups } from './Components/Groups'
import { ApiHelper } from '../../Utils/ApiHelper';
import { Tabs } from './Components/Tabs';
import { Household } from './Components/Household';
import { match } from "react-router-dom";

interface Identifiable { id: string; }

interface Props {
    matchedRoute: match<Identifiable>
}

export const PersonPage: React.FC<Props> = (props) => {
    return null;
    /*
    const [person, setPerson] = React.useState(null);

    React.useEffect(() => loadData(), [props.matchedRoute.params.id]);

    const loadData = () => {
        ApiHelper.apiGet('/people/' + props.matchedRoute.params.id)
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
    )*/

}
