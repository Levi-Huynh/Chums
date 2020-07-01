import React from 'react';
import { InputBox, QuestionEdit, ApiHelper, FormSubmissionInterface } from "./";

interface Props {
    addFormId: number,
    contentType: string,
    contentId: number,
    formSubmissionId: number,
    updatedFunction: (formId: number) => void


}

export const FormSubmissionEdit: React.FC<Props> = (props) => {
    const [formSubmission, setFormSubmission] = React.useState(null);

    const handleCancel = () => props.updatedFunction(0);

    const getAnswer = (questionId: number) => {
        var answers = formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
        return null;
    }

    const loadData = () => {
        if (props.formSubmissionId > 0) ApiHelper.apiGet('/formsubmissions/' + props.formSubmissionId + '/?include=questions,answers,form').then(data => setFormSubmission(data));
        else if (props.addFormId > 0) {
            ApiHelper.apiGet('/questions/?formId=' + props.addFormId).then(data => {
                var fs: FormSubmissionInterface = {
                    formId: props.addFormId, contentType: props.contentType, contentId: props.contentId, answers: []
                };
                fs.questions = data;
                setFormSubmission(fs);
            });
        }
    }

    const handleSave = () => {
        //*** This method ultimately triggers the following warning and I'm not sure why:
        /*
            index.js:1 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
            in FormSubmission (at AssociatedForms.tsx:33)
            in div (at AssociatedForms.tsx:33)
            in div (at AssociatedForms.tsx:32)
            in div (at AssociatedForms.tsx:26)
            in div (at AssociatedForms.tsx:46)
         */

        const fs = formSubmission;
        ApiHelper.apiPost('/formsubmissions/', [fs])
            .then(data => {
                fs.id = data[0];
                setFormSubmission(fs);
                props.updatedFunction(fs.formId);
            });
    }

    const handleChange = (questionId: number, value: string) => {
        var fs = formSubmission;
        var answer = null;
        for (var i = 0; i < fs.answers.length; i++) if (fs.answers[i].questionId === questionId) answer = fs.answers[i];
        if (answer !== null) answer.value = value;
        else {
            answer = { formSubmissionId: fs.id, questionId: questionId, value: value };
            fs.answers.push(answer);
        }
        setFormSubmission(fs);
    }


    React.useEffect(loadData, [props.formSubmissionId]);
    React.useEffect(() => { if (props.addFormId > 0) loadData(); }, [props.addFormId]);

    var questionList = [];
    if (formSubmission != null) {
        var questions = formSubmission.questions;
        for (var i = 0; i < questions.length; i++) questionList.push(<QuestionEdit key={questions[i].id} question={questions[i]} answer={getAnswer(questions[i].id)} changeFunction={handleChange} />);
    }

    return <InputBox headerText={formSubmission?.form?.name || 'Edit Form'} headerIcon="fas fa-user" saveFunction={handleSave} cancelFunction={handleCancel} >{questionList}</InputBox>;
}


