import React from 'react';
import { InputBox, ReportColumnInterface } from './';
import { Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

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
            case 'grouped': c.grouped = e.currentTarget.value === "true"; break;
            case 'formatType': c.formatType = e.currentTarget.value; break;
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
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Is Grouped?</FormLabel>
                        <FormControl as="select" name="grouped" value={column?.grouped?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Format Type</FormLabel>
                        <FormControl as="select" name="formatType" value={column?.formatType} onChange={handleChange} onKeyDown={handleKeyDown}>
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="currency">Currency</option>
                            <option value="date">Date</option>
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
        </InputBox>
    );
}
