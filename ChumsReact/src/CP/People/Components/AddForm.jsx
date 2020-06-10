import React, { Fragment } from 'react';
import ApiHelper from '../../../Utils/ApiHelper';




class AddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { forms: null, submittedForms: null, person: this.props.person, clicked: false, unsubmittedForms: [] };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    componentDidMount() {
        ApiHelper.apiGet('/forms?contentType=person').then(data => {
            this.setState({ forms: data });
            this.determineUnsubmitted();
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.person !== this.props.person) {
            this.setState({ person: this.props.person });
            this.determineUnsubmitted();
        }
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({ clicked: true });
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ selectedFormId: e.target.value });
    }

    handleAdd(e) {
        e.preventDefault();
        this.props.addFormFunction(this.state.selectedFormId)
    }

    determineUnsubmitted() {
        var unsubmittedForms = [];
        if (this.state.forms !== undefined && this.state.forms !== null && this.state.person !== null) {
            var sf = this.state.person.formSubmissions;
            if (sf !== undefined && sf !== null) {
                for (var i = 0; i < this.state.forms.length; i++) {
                    var exists = false;
                    for (var j = 0; j < sf.length; j++) if (sf[j].formId === this.state.forms[i].id) exists = true;
                    if (!exists) unsubmittedForms.push(this.state.forms[i]);
                }
            } else unsubmittedForms = this.state.forms;
        }
        var selectedFormId = (unsubmittedForms.length === 0) ? 0 : unsubmittedForms[0].id;
        this.setState({ unsubmittedForms: unsubmittedForms, selectedFormId: selectedFormId });
    }

    render() {
        if (this.state.unsubmittedForms.length === 0) return null;
        else if (!this.state.clicked) return (<Fragment><hr /><a href="#" onClick={this.handleClick}>Add a form</a></Fragment>);
        else {
            var options = [];
            for (var i = 0; i < this.state.unsubmittedForms.length; i++) {
                var uf = this.state.unsubmittedForms[i];
                options.push(<option value={uf.id}>{uf.name}</option>);
            }
            return (
                <Fragment>
                    <b>Add a form</b>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="input-group input-group-sm">
                                <select className="form-control form-control-sm" onChange={this.handleChange} >{options}</select>
                                <div className="input-group-append">
                                    <input type="submit" value="Add" className="btn btn-success btn-sm" onClick={this.handleAdd} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }


        return null;
    }
}

export default AddForm;

