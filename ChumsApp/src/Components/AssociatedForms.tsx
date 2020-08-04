import React from 'react';
import { FormSubmission, FormSubmissionEdit, FormSubmissionInterface, UserHelper } from './';
import { Button } from 'react-bootstrap';

interface Props {
    addFormId: number,
    contentType: string,
    contentId: number,
    formSubmissions: FormSubmissionInterface[],
    setAddFormFunction: (formId: number) => void
}

export const AssociatedForms: React.FC<Props> = (props) => {
    const [mode, setMode] = React.useState('display');
    const [editFormSubmissionId, setEditFormSubmissionId] = React.useState(0);

    const handleEdit = (formSubmissionId: number) => { setMode('edit'); setEditFormSubmissionId(formSubmissionId); }
    const handleUpdate = (formId: number) => { setMode('display'); props.setAddFormFunction(0); }
    const getCards = () => {
        var cards = [];
        if (props.formSubmissions !== undefined) {
            for (var i = 0; i < props.formSubmissions.length; i++) {
                var fs = props.formSubmissions[i];
                cards.push(
                    <div key={fs.id} className="card">
                        <div className="card-header" id={"heading" + fs.id}>
                            <div>
                                <Button variant="link" data-toggle="collapse" data-target={"#collapse" + fs.id} aria-controls={"collapse" + fs.id}>{fs.form.name}</Button>
                            </div>
                        </div>
                        <div id={"collapse" + fs.id} className="collapse" aria-labelledby={"heading" + fs.id} data-parent="#formSubmissionsAccordion">
                            <div className="card-body"><FormSubmission formSubmissionId={fs.id} editFunction={handleEdit} /> </div>
                        </div>
                    </div>
                );
            }
        }
        return cards;
    }


    if (!UserHelper.checkAccess('Forms', 'View')) return <></>
    if (mode === 'edit' || props.addFormId > 0) return <FormSubmissionEdit formSubmissionId={editFormSubmissionId} updatedFunction={handleUpdate} addFormId={props.addFormId} contentType={props.contentType} contentId={props.contentId} />
    else return <div className="accordion" id="formSubmissionsAccordion">{getCards()}</div>;
}
