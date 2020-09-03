import React from 'react';
import { PersonHelper, Helper, NoteInterface } from './'


interface Props { note: NoteInterface }

export const Note: React.FC<Props> = (props) => {
    const [note, setNote] = React.useState(null);

    React.useEffect(() => setNote(props.note), [props.note]);

    if (note === null) return null;
    const photoUrl = PersonHelper.getPhotoUrl(note.person);
    const displayDuration = Helper.getDisplayDuration(new Date(note.dateAdded + 'Z'));

    return (
        <div className="note">
            <div className="postedBy">
                <img src={photoUrl} alt="avatar" />
                {note.person.name.display} - {displayDuration} ago
                </div>
            <p>{note.contents.replace('\n', '<br/>')}</p>
        </div>
    )
}
