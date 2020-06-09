import React from 'react';
import FormSubmission from './FormSubmission';
import FormSubmissionEdit from "./FormSubmissionEdit";

class AssociatedForms extends React.Component {

    constructor(props) {
        super(props);
        this.state = { formSubmissions: this.props.formSubmissions, contentType: this.props.contentType, contentId: this.props.contentId, mode: 'display', editFormSubmissionId: 0, addFormId: this.props.addFormId };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentType !== this.props.contentType || prevProps.contentId !== this.props.contentId || prevProps.formSubmissions !== this.props.formSubmissions || prevProps.addFormId !== this.props.addFormId) {
            this.setState({ contentType: this.props.contentType, contentId: this.props.contentId, formSubmissions: this.props.formSubmissions, addFormId: this.props.addFormId });
        }
    }

    handleEdit(formSubmissionId) {
        this.setState({ mode: 'edit', editFormSubmissionId: formSubmissionId });
    }

    handleUpdate(person, e) {
        if (e !== undefined) e.preventDefault();
        this.setState({ mode: 'display', addFormId: 0 });
    }

    render() {
        if (this.state.mode === 'edit' || this.state.addFormId > 0) {
            return <FormSubmissionEdit formSubmissionId={this.state.editFormSubmissionId} updatedFunction={this.handleUpdate} addFormId={this.state.addFormId} contentType={this.state.contentType} contentId={this.state.contentId} />
        } else {
            if (this.state.formSubmissions !== undefined) {

                var cards = [];
                for (var i = 0; i < this.state.formSubmissions.length; i++) {
                    var fs = this.state.formSubmissions[i];
                    cards.push(
                        <div key={fs.id} className="card">
                            <div className="card-header" id={"heading" + fs.id}>
                                <h2>
                                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target={"#collapse" + fs.id} aria-controls={"collapse" + fs.id}>{fs.form.name}</button>
                                </h2>
                            </div>
                            <div id={"collapse" + fs.id} className="collapse" aria-labelledby={"heading" + fs.id} data-parent="#formSubmissionsAccordion">
                                <div className="card-body"><FormSubmission formSubmissionId={fs.id} editFunction={this.handleEdit} /> </div>
                            </div>
                        </div>
                    );
                }
            }
            return (
                <div className="accordion" id="formSubmissionsAccordion">
                    {cards}
                </div>
            );
        }
    }
}

export default AssociatedForms;

