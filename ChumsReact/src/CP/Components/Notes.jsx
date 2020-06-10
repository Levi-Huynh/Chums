import React from 'react';
import ApiHelper from '../../Utils/ApiHelper';
import Note from './Note'
import DisplayBox from './DisplayBox'
import InputBox from './InputBox'
import UserHelper from '../../Utils/UserHelper';

class Notes extends React.Component {

    constructor(props) {
        super(props);
        this.state = { notes: [], contentType: this.props.contentType, contentId: this.props.contentId, noteText: '' };
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentType !== this.props.contentType || prevProps.contentId !== this.props.contentId) {
            this.setState({ contentType: this.props.contentType, contentId: this.props.contentId })
            this.loadNotes();
        }
    }

    componentDidMount() {
        this.loadNotes();
    }

    loadNotes() {
        if (this.state.contentId > 0) ApiHelper.apiGet('/notes/' + this.state.contentType + '/' + this.state.contentId).then(data => this.setState({ notes: data }));
    }

    handleSave(e) {
        e.preventDefault();
        var n = { contentId: this.state.contentId, contentType: this.state.contentType, contents: this.state.noteText }
        ApiHelper.apiPost('/notes', [n]).then(() => {
            this.loadNotes();
            this.setState({ noteText: '' });
        });
    }

    handleChange = e => this.setState({ noteText: e.target.value });



    render() {
        var notes = [];
        for (var i = 0; i < this.state.notes.length; i++) notes.push(<Note note={this.state.notes[i]} key={this.state.notes[i].id} />);

        var canEdit = UserHelper.checkAccess('People', 'Edit Notes')
        if (!canEdit) return <DisplayBox headerIcon="far fa-sticky-note" headerText="Notes" >{notes}</DisplayBox>
        else return (

            <InputBox headerIcon="far fa-sticky-note" headerText="Notes" saveFunction={this.handleSave} saveText="Add Note" >
                {notes}<br />
                <div className="form-group">
                    <label>Add a Note</label>
                    <textarea className="form-control" name="contents" onChange={this.handleChange} value={this.state.noteText} />
                </div>
            </InputBox>

        )
    }
}

export default Notes;