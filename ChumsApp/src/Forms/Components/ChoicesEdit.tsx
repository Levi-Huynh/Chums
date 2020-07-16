import React from 'react';
import { QuestionInterface } from '.';
import { Table, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

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
                    <td><Button variant="danger" size="sm" onClick={handleRemove} data-index={i}>Remove</Button></td>
                </tr>);
            }
        }
        return result;
    }

    return (
        <FormGroup>
            <FormLabel>Choices</FormLabel>
            <Table size="sm">
                <thead><tr><th>Value</th><th>Text</th><th>Action</th></tr></thead>
                <tbody>
                    {getRows()}
                    <tr>
                        <td><FormControl size="sm" name="choiceValue" value={choiceValue} onChange={handleChange} /></td>
                        <td><FormControl size="sm" name="choiceText" value={choiceText} onChange={handleChange} /></td>
                        <td><Button id="addQuestionChoiceButton" variant="success" size="sm" onClick={handleAdd}>Add</Button></td>
                    </tr>
                </tbody>
            </Table>
        </FormGroup>
    );
}
