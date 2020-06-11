import React from 'react';
import { Helper } from '../../Utils/Helper';
import { QuestionInterface, AnswerInterface, FormSubmissionInterface } from '../../Utils/ApiHelper';

interface Props {
    question: QuestionInterface,
    answer: AnswerInterface
    formSubmissions?: FormSubmissionInterface[]
}

export const Question: React.FC<Props> = (props) => {
    const [formSubmissions, setFormSubmissions] = React.useState(props.formSubmissions);

    React.useEffect(() => setFormSubmissions(props.formSubmissions), [props.formSubmissions]);

    var q = props.question;
    var a = props.answer;
    if (a === null) return null;

    if (q.fieldType === 'Heading') return <h5>{q.title}</h5>;
    else {
        var displayValue = '';
        switch (q.fieldType) {
            case 'Date':
                displayValue = (a.value === null || a.value === "") ? "" : Helper.getShortDate(new Date(a.value));
                break;
            case 'Yes/No':
                displayValue = (a.value === null || a.value === "") ? "" : a.value.replace("False", "No").replace("True", "Yes");
                break;
            default:
                displayValue = a.value;
                break;
        }
        return <div><label>{q.title}:</label> {displayValue}</div>
    }
}
