import React from 'react';
import { QuestionInterface } from '.';

interface Props { question: QuestionInterface, updatedFunction: (question: QuestionInterface) => void }

export const ChoicesEdit: React.FC<Props> = (props) => {
    const [choiceValue, setChoiceValue] = React.useState('');
    const [choiceText, setChoiceText] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (e.target.name) {
            case 'choiceValue': setChoiceValue(e.target.value); break;
            case 'choiceText': setChoiceText(e.target.value); break;
        }
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        var q = { ...props.question };
        q.choices.splice(idx, 1);
        props.updatedFunction(q);
    }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var q = { ...props.question };
        if (q.choices === undefined) q.choices = [{ value: choiceValue, text: choiceText }];
        else q.choices.push({ value: choiceValue, text: choiceText });
        props.updatedFunction(q);
        setChoiceText('');
        setChoiceValue('');
    }

    const getRows = () => {
        var result = [];
        if (props.question.choices !== undefined) {
            for (let i = 0; i < props.question.choices.length; i++) {
                var c = props.question.choices[i];
                result.push(<tr key={i}>
                    <td>{c.value}</td>
                    <td>{c.text}</td>
                    <td><a href="about:blank" className="btn btn-danger btn-sm" onClick={handleRemove} data-index={i}>Remove</a></td>
                </tr>);
            }
        }
        return result;
    }

    return (
        <div className="form-group">
            <label>Choices</label>
            <table className="table table-sm">
                <tbody>
                    <tr><th>Value</th><th>Text</th><th>Action</th></tr>
                    {getRows()}
                    <tr>
                        <td><input type="text" className="form-control form-control-sm" name="choiceValue" value={choiceValue} onChange={handleChange} /></td>
                        <td><input type="text" className="form-control form-control-sm" name="choiceText" value={choiceText} onChange={handleChange} /></td>
                        <td><a href="about:blank" className="btn btn-success btn-sm" onClick={handleAdd}>Add</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
