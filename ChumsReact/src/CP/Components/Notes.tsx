import React from 'react';
import { ApiHelper, Note, DisplayBox, InputBox, UserHelper } from './';

interface Props { contentId: number, contentType: string }

export const Notes: React.FC<Props> = (props) => {
    const [notes, setNotes] = React.useState([]);
    const [noteText, setNoteText] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.currentTarget.value);
    const loadNotes = () => { if (props.contentId > 0) ApiHelper.apiGet('/notes/' + props.contentType + '/' + props.contentId).then(data => setNotes(data)); }
    const handleSave = () => {
        var n = { contentId: props.contentId, contentType: props.contentType, contents: noteText }
        ApiHelper.apiPost('/notes', [n]).then(() => { loadNotes(); setNoteText(''); });
    }
    React.useEffect(loadNotes, [props.contentId]);

    var noteArray: React.ReactNode[] = [];
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
