import React from 'react';
import ApiHelper from '../../Utils/ApiHelper';
import Note from './Note'
import DisplayBox from './DisplayBox'
import InputBox from './InputBox'
import UserHelper from '../../Utils/UserHelper';

const Notes = (props) => {
    const [notes, setNotes] = React.useState([]);
    const [noteText, setNoteText] = React.useState('');

    const handleChange = e => setNoteText(e.target.value);
    const loadNotes = () => {
        if (props.contentId > 0) ApiHelper.apiGet('/notes/' + props.contentType + '/' + props.contentId).then(data => setNotes(data));
    }
    const handleSave = e => {
        e.preventDefault();
        var n = { contentId: props.contentId, contentType: props.contentType, contents: noteText }
        ApiHelper.apiPost('/notes', [n]).then(() => { loadNotes(); setNoteText(''); });
    }
    React.useEffect(() => loadNotes(), [props.contentId]);

    var noteArray = [];
    for (var i = 0; i < notes.length; i++) noteArray.push(<Note note={notes[i]} key={notes[i].id} />);

    var canEdit = UserHelper.checkAccess('People', 'Edit Notes')
    if (!canEdit) return <DisplayBox headerIcon="far fa-sticky-note" headerText="Notes" >{noteArray}</DisplayBox>
    else return (
        <InputBox headerIcon="far fa-sticky-note" headerText="Notes" saveFunction={handleSave} saveText="Add Note" >
            {noteArray}<br />
            <div className="form-group">
                <label>Add a Note</label>
                <textarea className="form-control" name="contents" onChange={handleChange} value={noteText} />
            </div>
        </InputBox>

    )


}


export default Notes;