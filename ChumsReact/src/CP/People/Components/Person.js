import React, { Fragment } from 'react';
import UserContext from '../../../UserContext'
import PersonHelper from '../../../Utils/PersonHelper'
import PersonView from './PersonView'
import PersonEdit from './PersonEdit'

class Person extends React.Component {

    constructor(props) {
        super(props);
        this.state = { mode: 'display', person: this.props.person };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.person !== this.props.person) {
            this.setState({ person: this.props.person })
        }
    }


    handleEdit(e) {
        e.preventDefault();
        this.setState({ mode: 'edit' });
    }

    handleUpdate(person, e) {
        if (e !== undefined) e.preventDefault();
        this.setState({ mode: 'display' });
        if (person !== null) this.setState({ person: person });
    }

    render() {
        if (this.state.mode === 'display') return <PersonView person={this.state.person} editFunction={this.handleEdit} />
        else return <PersonEdit person={this.state.person} updatedFunction={this.handleUpdate} />
    }
}

export default Person;