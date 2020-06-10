import React from 'react';
import Person from './Components/Person'
import Groups from './Components/Groups'
import ApiHelper from '../../Utils/ApiHelper';
import Tabs from './Components/Tabs';
import Household from './Components/Household';

const PersonPage = (props) => {
    const [person, setPerson] = React.useState(null);

    React.useEffect(() => loadData(), [props.match.params.id]);

    const loadData = () => {
        ApiHelper.apiGet('/people/' + props.match.params.id)
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

export default PersonPage;
