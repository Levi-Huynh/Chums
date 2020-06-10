import React from 'react';
import PersonView from './PersonView'
import PersonEdit from './PersonEdit'

class Person extends React.Component {

    constructor(props) {
        super(props);
        this.state = { mode: 'display', person: this.props.person };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAddForm = this.handleAddForm.bind(this);
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

    handleAddForm(formId) {
        this.setState({ addFormId: formId, mode: 'display' });
    }

    render() {
        if (this.state.mode === 'display') return <PersonView person={this.state.person} editFunction={this.handleEdit} addFormId={this.state.addFormId} />
        else return <PersonEdit person={this.state.person} updatedFunction={this.handleUpdate} addFormFunction={this.handleAddForm} />
    }
}

export default Person;