import React from 'react';
import InputBox from "./InputBox";
import ApiHelper from '../../Utils/ApiHelper';
import QuestionEdit from "./QuestionEdit";

const FormSubmissionEdit = (props) => {
    const [formSubmission, setFormSubmission] = React.useState(null);
    const [addFormId, setAddFormId] = React.useState(props.addFormId);

    const handleCancel = e => { e.preventDefault(); props.updatedFunction(); }

    const getAnswer = questionId => {
        var answers = formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
        return null;
    }

    const loadData = () => {
        if (props.formSubmissionId > 0) ApiHelper.apiGet('/formsubmissions/' + props.formSubmissionId + '/?include=questions,answers,form').then(data => setFormSubmission(data));
        else if (addFormId > 0) {
            ApiHelper.apiGet('/questions/?formId=' + addFormId).then(data => {
                var fs = { formId: addFormId, contentType: props.contentType, contentId: props.contentId, answers: [] };
                fs.questions = data;
                setFormSubmission(fs);
            });
        }
    }

    const handleSave = e => {
        e.preventDefault();
        const fs = formSubmission;
        ApiHelper.apiPost('/formsubmissions/', [fs])
            .then(data => {
                fs.id = data[0];
                setFormSubmission(fs);
                props.updatedFunction();
            });
    }

    const handleChange = (questionId, value) => {
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


    React.useEffect(() => loadData(), [props.formSubmissionId]);
    React.useEffect(() => { setAddFormId(props.addFormId); loadData(); }, [props.addFormId]);

    var questionList = [];
    if (formSubmission != null) {
        var questions = formSubmission.questions;
        for (var i = 0; i < questions.length; i++) questionList.push(<QuestionEdit key={questions[i].id} question={questions[i]} answer={getAnswer(questions[i].id)} changeFunction={handleChange} />);
    }

    return <InputBox headerText={formSubmission?.form?.name || 'Edit Form'} saveFunction={handleSave} cancelFunction={handleCancel} >{questionList}</InputBox>;
}

export default FormSubmissionEdit;


