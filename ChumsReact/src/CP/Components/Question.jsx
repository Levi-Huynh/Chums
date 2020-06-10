import React from 'react';
import Helper from '../../Utils/Helper';

class Question extends React.Component {

    constructor(props) {
        super(props);
        this.state = { formSubmissions: this.props.formSubmissions, contentType: this.props.contentType, contentId: this.props.contentId };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contentType !== this.props.contentType || prevProps.contentId !== this.props.contentId || prevProps.formSubmissions !== this.props.formSubmissions) {
            this.setState({ contentType: this.props.contentType, contentId: this.props.contentId, formSubmissions: this.props.formSubmissions });
        }
    }

    render() {
        var q = this.props.question;
        var a = this.props.answer;
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
}

export default Question;
