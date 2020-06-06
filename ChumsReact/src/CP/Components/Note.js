import React from 'react';
import PersonHelper from '../../Utils/PersonHelper'
import UserHelper from '../../Utils/UserHelper'
import Helper from '../../Utils/Helper'

class Note extends React.Component {
    render() {
        const photoUrl = PersonHelper.getPhotoUrl(UserHelper.church.id, this.props.note.addedBy, this.props.note.person.photoUpdated);
        const displayDuration = Helper.getDisplayDuration(new Date(this.props.note.dateAdded + 'Z'));
        return (
            <div className="note">
                <div className="postedBy">
                    <img src={photoUrl} alt="avatar" />
                    {this.props.note.person.displayName} - {displayDuration} ago
                </div>
                <p>{this.props.note.contents.replace('\n', '<br/>')}</p>
            </div>
        )
    }
}

export default Note;