import React, { Fragment } from 'react';
import ApiHelper from '../../Utils/ApiHelper';
import Question from "./Question";

class FormSubmission extends React.Component {

    constructor(props) {
        super(props);
        this.state = { formSubmission: null, formSubmissionId: this.props.formSubmissionId };
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.formSubmissionId !== this.props.formSubmissionId) {
            this.setState({ formSubmissionId: this.props.formSubmissionId });
            this.loadData();
        }
    }

    componentDidMount() { this.loadData(); }

    loadData() {
        if (this.state.formSubmissionId > 0) ApiHelper.apiGet('/formsubmissions/' + this.state.formSubmissionId + '/?include=questions,answers').then(data => this.setState({ formSubmission: data }));
    }

    getAnswer(questionId) {
        var answers = this.state.formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
        return null;
    }

    handleEdit(e) {
        e.preventDefault();
        this.props.editFunction(this.state.formSubmissionId);
    }

    render() {
        var firstHalf = [];
        var secondHalf = [];
        if (this.state.formSubmission != null) {
            var questions = this.state.formSubmission.questions;
            var halfWay = Math.round(questions.length / 2);
            for (var i = 0; i < halfWay; i++) firstHalf.push(<Question key={i} question={questions[i]} answer={this.getAnswer(questions[i].id)} />);
            for (var j = halfWay; j < questions.length; j++) secondHalf.push(<Question key={j} question={questions[j]} answer={this.getAnswer(questions[j].id)} />);
        }


        return (
            <Fragment>
                <a href="#" className="fa-pull-right" onClick={this.handleEdit}><i className="fas fa-pencil-alt"></i></a>
                <div className="content">
                    <div className="row">
                        <div className="col-lg-6">{firstHalf}</div>
                        <div className="col-lg-6">{secondHalf}</div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default FormSubmission;

