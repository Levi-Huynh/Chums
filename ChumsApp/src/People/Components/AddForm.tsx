import React, { ChangeEvent } from 'react';
import { ApiHelper, PersonInterface } from './';
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';

interface Props { person: PersonInterface, addFormFunction: (selectedFormId: number) => void }

export const AddForm: React.FC<Props> = (props) => {
    const [forms, setForms] = React.useState(null);
    const [unsubmittedForms, setUnsubmittedForms] = React.useState([]);
    const [clicked, setClicked] = React.useState(false);
    const [selectedFormId, setSelectedFormId] = React.useState(0);
    const handleClick = (e: React.MouseEvent) => { e.preventDefault(); setClicked(true); };
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => { e.preventDefault(); setSelectedFormId(parseInt(e.currentTarget.value)); };
    const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); props.addFormFunction(selectedFormId); };

    const determineUnsubmitted = () => {
        var unsubmitted = [];
        if (forms !== undefined && forms !== null && props.person !== null) {
            var sf = props.person.formSubmissions;
            if (sf !== undefined && sf !== null) {
                for (var i = 0; i < forms.length; i++) {
                    var exists = false;
                    for (var j = 0; j < sf.length; j++) if (sf[j].formId === forms[i].id) exists = true;
                    if (!exists) unsubmitted.push(forms[i]);
                }
            } else unsubmitted = forms;
        }
        setSelectedFormId((unsubmitted.length === 0) ? 0 : unsubmitted[0].id);
        setUnsubmittedForms(unsubmitted);
    }

    React.useEffect(() => { ApiHelper.apiGet('/forms?contentType=person').then(data => setForms(data)); }, []);
    React.useEffect(determineUnsubmitted, [forms]);

    if (unsubmittedForms.length === 0) return null;
    else if (!clicked) return (<><hr /><a href="about:blank" onClick={handleClick}>Add a form</a></>);
    else {
        var options = [];
        for (var i = 0; i < unsubmittedForms.length; i++) {
            var uf = unsubmittedForms[i];
            options.push(<option value={uf.id} key={uf.id}>{uf.name}</option>);
        }
        return (
            <>
                <b>Add a form</b>
                <Row>
                    <Col lg={6}>
                        <InputGroup size="sm">
                            <FormControl id="addFormName" as="select" size="sm" onChange={handleChange} >{options}</FormControl>
                            <InputGroup.Append><Button id="addFormButton" variant="success" size="sm" onClick={handleAdd}>Add</Button></InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
            </>
        );
    }

}
