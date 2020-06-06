import React from 'react';
import Person from './Components/Person'
import Groups from './Components/Groups'
import ApiHelper from '../../Utils/ApiHelper';
import Tabs from './Components/Tabs';

class PersonPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { person: null, errors: [] };
    }

    componentDidMount() {
        ApiHelper.apiGet('/people/' + this.props.match.params.id)
            .then(data => this.setState({ person: data }));
    }


    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <Person person={this.state.person} />
                    <Tabs personId={this.state.person?.id} />
                </div >
                <div className="col-md-4">
                    <Groups personId={this.state.person?.id} />
                </div>
            </div >
        )
    }
}

export default PersonPage;