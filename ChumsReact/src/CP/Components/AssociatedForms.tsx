import React from 'react';
import { FormSubmission } from './FormSubmission';
import { FormSubmissionEdit } from "./FormSubmissionEdit";
import { FormSubmissionInterface } from '../../Utils/ApiHelper';

interface Props {
    addFormId: number,
    contentType: string,
    contentId: number,
    formSubmissions: FormSubmissionInterface[]

}

export const AssociatedForms: React.FC<Props> = (props) => {
    const [mode, setMode] = React.useState('display');
    const [addFormId, setAddFormId] = React.useState(0);
    const [contentId, setContentId] = React.useState(props.contentId);
    const [contentType, setContentType] = React.useState(props.contentType);
    const [editFormSubmissionId, setEditFormSubmissionId] = React.useState(0);
    const [formSubmissions, setFormSubmissions] = React.useState(props.formSubmissions);

    const handleEdit = (formSubmissionId: number) => { setMode('edit'); setEditFormSubmissionId(formSubmissionId); }
    const handleUpdate = (formId: number) => { setMode('display'); setAddFormId(formId); }

    React.useEffect(() => setAddFormId(props.addFormId), [props.addFormId]);
    React.useEffect(() => setContentId(props.contentId), [props.contentId]);
    React.useEffect(() => setContentType(props.contentType), [props.contentType]);
    React.useEffect(() => setFormSubmissions(props.formSubmissions), [props.formSubmissions]);


    if (mode === 'edit' || addFormId > 0) return <FormSubmissionEdit formSubmissionId={editFormSubmissionId} updatedFunction={handleUpdate} addFormId={addFormId} contentType={contentType} contentId={contentId} />
    else {
        if (formSubmissions !== undefined) {
            var cards = [];
            for (var i = 0; i < formSubmissions.length; i++) {
                var fs = formSubmissions[i];
                cards.push(
                    <div key={fs.id} className="card">
                        <div className="card-header" id={"heading" + fs.id}>
                            <h2>
                                <button className="btn btn-link" type="button" data-toggle="collapse" data-target={"#collapse" + fs.id} aria-controls={"collapse" + fs.id}>{fs.form.name}</button>
                            </h2>
                        </div>
                        <div id={"collapse" + fs.id} className="collapse" aria-labelledby={"heading" + fs.id} data-parent="#formSubmissionsAccordion">
                            <div className="card-body"><FormSubmission formSubmissionId={fs.id} editFunction={handleEdit} /> </div>
                        </div>
                    </div>
                );
            }
        }
        return <div className="accordion" id="formSubmissionsAccordion">{cards}</div>;
    }
}
