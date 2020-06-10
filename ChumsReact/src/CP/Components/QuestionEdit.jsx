import React from 'react';

class QuestionEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = { answerValue: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.answer !== this.props.answer) {
            var answerValue = (this.props.answer === null) ? '' : this.props.answer.value;
            this.setState({ answerValue: answerValue });
        }
    }

    handleChange(e) {
        this.setState({ answerValue: e.target.value });
        this.props.changeFunction(this.props.question.id, e.target.value);
    }

    render() {
        var q = this.props.question;

        if (q.fieldType === 'Heading') return <h5>{q.title}</h5>;
        else {
            var input = null;
            var choiceOptions = null;
            if (q.choices !== undefined && q.choices !== null) {
                for (var i = 0; i < q.choices.length; i++) choiceOptions.push(<option value={q.choices[i].value}>{q.choices[i].text}</option>);
            }

            switch (q.fieldType) {
                case "TextBox": input = <input type="text" className="form-control" value={this.state.answerValue} placeholder={q.placeholder} onChange={this.handleChange} />; break;
                case "Multiple Choice": input = <select className="form-control" value={this.state.answerValue} onChange={this.handleChange}>{choiceOptions}</select>; break;
                case "Yes/No": input = <select className="form-control" value={this.state.answerValue} onChange={this.handleChange}><option value="False">No</option><option value="True">Yes</option></select>; break;
                case "Whole Number":
                case "Decimal":
                    input = input = <input type="number" className="form-control" value={this.state.answerValue} placeholder={q.placeholder} onChange={this.handleChange} />;
                    break;
                case "Date": input = <input type="date" className="form-control" value={this.state.answerValue} placeholder={q.placeholder} onChange={this.handleChange} />; break;
                case "Phone Number": input = <input type="tel" className="form-control" value={this.state.answerValue} placeholder="555-555-5555" onChange={this.handleChange} />; break;
                case "Email": input = <input type="email" className="form-control" value={this.state.answerValue} placeholder="john@doe.com" onChange={this.handleChange} />; break;
                case "Text Area": input = <textarea className="form-control" value={this.state.answerValue} placeholder={q.placeholder} onChange={this.handleChange} />; break;
                default: return null;
            }


            var desc = (q.description === null || q.description === '') ? '' : <span className="description">({q.description})</span>

            return <div className="form-group"><label>{q.title}{desc}</label>{input}</div>;
        }

    }
}

export default QuestionEdit;
