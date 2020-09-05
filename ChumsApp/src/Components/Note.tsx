import React from 'react';
import { PersonHelper, Helper, NoteInterface } from './'


interface Props { note: NoteInterface }

export const Note: React.FC<Props> = (props) => {
    const [note, setNote] = React.useState(null);

    React.useEffect(() => setNote(props.note), [props.note]);

    if (note === null) return null;
    const photoUrl = PersonHelper.getPhotoUrl(note.person);
    var datePosted = new Date(note.dateAdded);
    datePosted.setTime(datePosted.getTime() - (datePosted.getTimezoneOffset() * 60 * 1000));
    const displayDuration = Helper.getDisplayDuration(datePosted);

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
