import React from 'react';
import PersonHelper from '../../Utils/PersonHelper'
import UserHelper from '../../Utils/UserHelper'
import Helper from '../../Utils/Helper'

const Note = (props) => {
    const [note, setNote] = React.useState(null);

    React.useEffect(() => setNote(props.note), [props.note]);

    if (note === null) return null;
    const photoUrl = PersonHelper.getPhotoUrl(UserHelper.church.id, note.addedBy, note.person.photoUpdated);
    const displayDuration = Helper.getDisplayDuration(new Date(note.dateAdded + 'Z'));

    return (
        <div className="note">
            <div className="postedBy">
                <img src={photoUrl} alt="avatar" />
                {note.person.displayName} - {displayDuration} ago
                </div>
            <p>{note.contents.replace('\n', '<br/>')}</p>
        </div>
    )
}

export default Note;