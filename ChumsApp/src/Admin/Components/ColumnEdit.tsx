import React from 'react';
import { ApiHelper, InputBox, ReportColumnInterface } from './';
import { Row, Col, FormGroup, FormLabel, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props { column: ReportColumnInterface, updatedFunction: (column: ReportColumnInterface) => void }

export const ColumnEdit = (props: Props) => {
    const [column, setColumn] = React.useState<ReportColumnInterface>(null);

    const handleSave = () => { props.updatedFunction(column); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        var c = { ...column };
        switch (e.currentTarget.name) {
            case 'heading': c.heading = e.currentTarget.value; break;
            case 'field': c.field = e.currentTarget.value; break;
        }
        setColumn(c);
    }

    React.useEffect(() => setColumn(props.column), [props.column]);

    return (
        <InputBox headerIcon="far fa-chart-bar" headerText="Reports" saveFunction={handleSave} >
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Display Heading</FormLabel>
                        <FormControl type="text" name="heading" value={column?.heading} onChange={handleChange} onKeyDown={handleKeyDown} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Database Field</FormLabel>
                        <FormControl type="text" name="field" value={column?.field} onChange={handleChange} onKeyDown={handleKeyDown} />
                    </FormGroup>
                </Col>
            </Row>
        </InputBox>
    );
}
