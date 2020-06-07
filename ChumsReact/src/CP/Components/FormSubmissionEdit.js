import React from 'react';
import InputBox from "./InputBox";
import ApiHelper from '../../Utils/ApiHelper';
import QuestionEdit from "./QuestionEdit";

class FormSubmissionEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = { formSubmission: null, formSubmissionId: this.props.formSubmissionId };
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.formSubmissionId !== this.props.formSubmissionId) {
            this.setState({ formSubmissionId: this.props.formSubmissionId });
            this.loadData();
        }
    }

    componentDidMount() { this.loadData(); }

    loadData() {
        if (this.state.formSubmissionId > 0) ApiHelper.apiGet('/formsubmissions/' + this.state.formSubmissionId + '/?include=questions,answers,form').then(data => this.setState({ formSubmission: data }));
    }

    getAnswer(questionId) {
        var answers = this.state.formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId == questionId) return answers[i];
        return null;
    }



    handleSave(e) {
        e.preventDefault();

        const fs = this.state.formSubmission;
        ApiHelper.apiPost('/formsubmissions/', [fs])
            .then(data => {
                fs.id = data[0];
                this.setState({ formSubmission: fs });;
                this.props.updatedFunction();
            });
    }


    handleCancel(e) {
        e.preventDefault();
        this.props.updateFunction();
    }

    handleChange(questionId, value) {
        var fs = this.state.formSubmission;
        var answer = null;
        for (var i = 0; i < fs.answers.length; i++) if (fs.answers[i].questionId == questionId) answer = fs.answers[i];
        if (answer !== null) answer.value = value;
        else {
            answer = { formSubmissionId: fs.id, questionId: questionId, value: value };
            fs.answers.push(answer);
        }
        this.setState({ formSubmission: fs });
    }

    render() {
        var questionList = [];
        if (this.state.formSubmission != null) {
            var questions = this.state.formSubmission.questions;
            for (var i = 0; i < questions.length; i++) questionList.push(<QuestionEdit key={questions[i].id} question={questions[i]} answer={this.getAnswer(questions[i].id)} changeFunction={this.handleChange} />);
        }

        return (
            <InputBox headerText={this.state.formSubmission?.form?.name || ''} saveFunction={this.handleSave} cancelFunction={this.handleCancel} >
                {questionList}
            </InputBox>
        );
    }
}

export default FormSubmissionEdit;


