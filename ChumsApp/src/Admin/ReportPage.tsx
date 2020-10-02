import React from 'react';
import { ApiHelper, ReportList, ReportInterface, InputBox, ErrorMessages, ColumnEdit, ReportColumnInterface } from './Components';
import { Row, Col, FormGroup, FormLabel, FormControl} from 'react-bootstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';

type TParams = { id?: string };
export const ReportPage = ({ match }: RouteComponentProps<TParams>) => {
    const [report, setReport] = React.useState({} as ReportInterface);
    const [errors, setErrors] = React.useState([]);
    const [redirectUrl, setRedirectUrl] = React.useState("");
    const [editColumnIndex, setEditColumnIndex] = React.useState(-1);

    const loadData = () => { ApiHelper.apiGet('/reports/' + match.params.id).then(data => setReport(data)); }
    const redirect = () => { setRedirectUrl("/admin/reports"); }
    const handleSave = () => { if (validate()) ApiHelper.apiPost('/reports', [report]).then(redirect) }
    // const handleDelete = () => { if (window.confirm('Are you sure you wish to permanently delete this report?')) ApiHelper.apiDelete('/reports/' + report.id).then(redirect); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }

    const validate = () => {
        var errors = [];
        if (report.title === '') errors.push("Title cannot be blank.");
        setErrors(errors);
        return errors.length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        var r = { ...report };
        switch (e.currentTarget.name) {
            case 'keyName': r.keyName = e.currentTarget.value; break;
            case 'title': r.title = e.currentTarget.value; break;
            case 'query': r.query = e.currentTarget.value; break;
            case 'parameters': r.parameters = e.currentTarget.value; break;
            case 'reportType': r.reportType = e.currentTarget.value; break;
            case 'groupLevels': r.groupLevels = parseInt(e.currentTarget.value, 0); break;
            //case 'columns': r.columns = e.currentTarget.value; break;
        }
        setReport(r);
    }

    const moveUp = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var row = anchor.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var tmpReport = { ...report };
        var col = tmpReport.columns.splice(idx, 1)[0];
        tmpReport.columns.splice(idx - 1, 0, col);
        setReport(tmpReport);
    }

    const moveDown = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var row = anchor.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var tmpReport = { ...report };
        var col = tmpReport.columns.splice(idx, 1)[0];
        tmpReport.columns.splice(idx + 1, 0, col);
        setReport(tmpReport);
    }

    const editColumn = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var row = anchor.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        setEditColumnIndex(idx);
    }

    const deleteColumn = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var row = anchor.parentNode.parentNode as HTMLElement;
        var idx = parseInt(row.getAttribute('data-index'));
        var tmpReport = { ...report };
        var col = tmpReport.columns.splice(idx, 1)[0];
        if (window.confirm("Are you sure you wish to remove the column " + col.heading + "?")) setReport(tmpReport);
    }




    const getColumns = () => {
        const result: JSX.Element[] = [];
        if (report?.columns !== undefined) {
            for (let i = 0; i < report.columns.length; i++) {
                var upArrow = (i === 0) ? <span style={{ display: 'inline-block', width: 20 }} /> : <> &nbsp; <a href="about:blank" onClick={moveUp}><i className="fas fa-arrow-up" /></a> </>
                var downArrow = (i === report.columns.length - 1) ? <></> : <> &nbsp; <a href="about:blank" onClick={moveDown}><i className="fas fa-arrow-down" /></a></>
                const editLink = <a href="about:blank" onClick={editColumn}><i className="fas fa-pencil-alt" /></a>
                const deleteLink = <a href="about:blank" onClick={deleteColumn}><i className="fas fa-trash-alt" /></a>
                result.push(
                    <tr key={i} data-index={i} >
                        <td>{report.columns[i].heading}</td>
                        <td style={{ textAlign: 'right' }}>{editLink}{upArrow}{downArrow}{deleteLink}</td>
                    </tr>
                );
            }
        }
        return result;
    }

    const getColumnEditor = () => {
        if (editColumnIndex < 0) return null;
        else {
            const col = (editColumnIndex >= report?.columns?.length) ? {} : report.columns[editColumnIndex];
            return <ColumnEdit column={col} updatedFunction={handleColumnUpdate} />
        }
    }

    const handleColumnUpdate = (column: ReportColumnInterface) => {
        if (editColumnIndex >= report.columns.length) report.columns.push(column);
        else report.columns[editColumnIndex] = column;
        setEditColumnIndex(-1);
    }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (report.columns === undefined) report.columns = [];
        setEditColumnIndex(report?.columns?.length);
    }


    React.useEffect(loadData, [match.params]);

    if (redirectUrl !== '') return <Redirect to={redirectUrl}></Redirect>;
    else return (
        <>
            <h1><i className="far fa-chart-bar"></i> Edit Report</h1>
            <Row>
                <Col lg={8}>

                    <InputBox headerIcon="far fa-chart-bar" headerText="Edit Report" saveFunction={handleSave} >
                        <ErrorMessages errors={errors} />
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Key Name</FormLabel>
                                    <FormControl type="text" name="keyName" value={report.keyName} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl type="text" name="title" value={report.title} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Query</FormLabel>
                                    <FormControl as="textarea" rows={8} name="query" value={report.query} onChange={handleChange} onKeyDown={handleKeyDown} style={{ fontSize: 11 }} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Parameters</FormLabel>
                                    <FormControl type="text" name="parameters" value={report.parameters} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Report Type</FormLabel>
                                    <FormControl as="select" name="reportType" value={report.reportType} onChange={handleChange} onKeyDown={handleKeyDown}>
                                        <option value="Grouped">Grouped</option>
                                        <option value="Bar Chart">Bar Chart</option>
                                    </FormControl>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <div>
                                        <span className="float-right"><a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a></span>
                                        <FormLabel>

                                            Columns
                                        </FormLabel>
                                    </div>
                                    <table className="table table-sm">
                                        <tbody>
                                            {getColumns()}
                                        </tbody>
                                    </table>

                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel>Group Levels</FormLabel>
                                    <FormControl type="text" name="groupLevels" value={report.groupLevels} onChange={handleChange} onKeyDown={handleKeyDown} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </InputBox>
                </Col>
                <Col lg={4}>
                    <ReportList />
                    {getColumnEditor()}
                </Col>
            </Row>
        </>
    );
}
