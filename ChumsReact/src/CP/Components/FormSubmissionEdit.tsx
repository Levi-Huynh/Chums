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
    const [addFormId, setAddFormId] = React.useState(props.addFormId);

    const handleCancel = () => props.updatedFunction(0);

    const getAnswer = (questionId: number) => {
        var answers = formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
        return null;
    }

    const loadData = () => {
        if (props.formSubmissionId > 0) ApiHelper.apiGet('/formsubmissions/' + props.formSubmissionId + '/?include=questions,answers,form').then(data => setFormSubmission(data));
        else if (addFormId > 0) {
            ApiHelper.apiGet('/questions/?formId=' + addFormId).then(data => {
                var fs: FormSubmissionInterface = {
                    formId: addFormId, contentType: props.contentType, contentId: props.contentId, answers: []
                };
                fs.questions = data;
                setFormSubmission(fs);
            });
        }
    }

    const handleSave = () => {
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
    React.useEffect(() => { setAddFormId(props.addFormId); loadData(); }, [props.addFormId]);

    var questionList = [];
    if (formSubmission != null) {
        var questions = formSubmission.questions;
        for (var i = 0; i < questions.length; i++) questionList.push(<QuestionEdit key={questions[i].id} question={questions[i]} answer={getAnswer(questions[i].id)} changeFunction={handleChange} />);
    }

    return <InputBox headerText={formSubmission?.form?.name || 'Edit Form'} headerIcon="fas fa-user" saveFunction={handleSave} cancelFunction={handleCancel} >{questionList}</InputBox>;
}


