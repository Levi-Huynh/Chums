import React from 'react';
import { AnswerInterface, QuestionInterface } from './';

interface Props {
    answer: AnswerInterface
    answerValue?: string,
    question: QuestionInterface,
    changeFunction: (questionId: number, value: string) => void

}

export const QuestionEdit: React.FC<Props> = (props) => {
    const [answerValue, setAnswerValue] = React.useState(props.answerValue);

    React.useEffect(() => setAnswerValue(props.answer.value), [props.answer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setAnswerValue(e.target.value);
        props.changeFunction(props.question.id, e.target.value);
    }

    var q = props.question;

    if (q.fieldType === 'Heading') return <h5>{q.title}</h5>;
    else {
        var input = null;
        var choiceOptions = [];
        if (q.choices !== undefined && q.choices !== null) {
            for (var i = 0; i < q.choices.length; i++) choiceOptions.push(<option value={q.choices[i].value}>{q.choices[i].text}</option>);
        }

        switch (q.fieldType) {
            case "TextBox": input = <input type="text" className="form-control" value={answerValue} placeholder={q.placeholder} onChange={handleChange} />; break;
            case "Multiple Choice": input = <select className="form-control" value={answerValue} onChange={handleChange}>{choiceOptions}</select>; break;
            case "Yes/No": input = <select className="form-control" value={answerValue} onChange={handleChange}><option value="False">No</option><option value="True">Yes</option></select>; break;
            case "Whole Number":
            case "Decimal":
                input = input = <input type="number" className="form-control" value={answerValue} placeholder={q.placeholder} onChange={handleChange} />;
                break;
            case "Date": input = <input type="date" className="form-control" value={answerValue} placeholder={q.placeholder} onChange={handleChange} />; break;
            case "Phone Number": input = <input type="tel" className="form-control" value={answerValue} placeholder="555-555-5555" onChange={handleChange} />; break;
            case "Email": input = <input type="email" className="form-control" value={answerValue} placeholder="john@doe.com" onChange={handleChange} />; break;
            case "Text Area": input = <textarea className="form-control" value={answerValue} placeholder={q.placeholder} onChange={handleChange} />; break;
            default: return null;
        }
        var desc = (q.description === null || q.description === '') ? '' : <span className="description">({q.description})</span>
        return <div className="form-group"><label>{q.title}{desc}</label>{input}</div>;
    }


}


