import React from 'react';
import { ApiHelper } from '../../Utils/ApiHelper';
import { Question } from "./Question";

interface Props {
    formSubmissionId: number,
    editFunction: (formSubmissionId: number) => void

}

export const FormSubmission: React.FC<Props> = (props) => {
    const [formSubmission, setFormSubmission] = React.useState(null);

    const handleEdit = (e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); props.editFunction(props.formSubmissionId); }
    const loadData = () => { if (props.formSubmissionId > 0) ApiHelper.apiGet('/formsubmissions/' + props.formSubmissionId + '/?include=questions,answers').then(data => setFormSubmission(data)); }
    const getAnswer = (questionId: number) => {
        var answers = formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
        return null;
    }
    React.useEffect(() => loadData(), [props.formSubmissionId]);

    var firstHalf = [];
    var secondHalf = [];
    if (formSubmission != null) {
        var questions = formSubmission.questions;
        var halfWay = Math.round(questions.length / 2);
        for (var i = 0; i < halfWay; i++) firstHalf.push(<Question key={i} question={questions[i]} answer={getAnswer(questions[i].id)} />);
        for (var j = halfWay; j < questions.length; j++) secondHalf.push(<Question key={j} question={questions[j]} answer={getAnswer(questions[j].id)} />);
    }

    return (
        <>
            <a href="#" className="fa-pull-right" onClick={handleEdit}><i className="fas fa-pencil-alt"></i></a>
            <div className="content">
                <div className="row">
                    <div className="col-lg-6">{firstHalf}</div>
                    <div className="col-lg-6">{secondHalf}</div>
                </div>
            </div>
        </>
    );
}

