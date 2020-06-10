import React from 'react';
import PersonView from './PersonView'
import PersonEdit from './PersonEdit'

const Person = (props) => {
    const [mode, setMode] = React.useState('display');
    const [person, setPerson] = React.useState(props.person);
    const [addFormId, setAddFormId] = React.useState(0);
    const handleEdit = e => { e.preventDefault(); setMode('edit'); }
    const handleAddForm = formId => { setMode('display'); setAddFormId(formId); }
    const handleUpdate = p => { setMode('display'); setPerson(p); }

    React.useEffect(() => setPerson(props.person), [props.person]);

    if (mode === 'display') return <PersonView person={person} editFunction={handleEdit} addFormId={addFormId} />
    else return <PersonEdit person={person} updatedFunction={handleUpdate} addFormFunction={handleAddForm} />
}

export default Person;