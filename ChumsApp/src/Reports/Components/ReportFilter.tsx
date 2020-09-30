import React from 'react';
import { ApiHelper, DisplayBox, ReportInterface } from './';
import { Link } from 'react-router-dom';
import { InputBox, ReportValueInterface, Helper } from '../../Components';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';

interface Props { report?: ReportInterface, updateFunction: (values: ReportValueInterface[]) => void }

export const ReportFilter = (props: Props) => {
    const [report, setReport] = React.useState<ReportInterface>(null);

    const handleUpdate = () => { props.updateFunction(report.values); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdate(); } }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        var r = { ...report };
        r.values.forEach(v => { if (v.key === e.currentTarget.name) v.value = e.currentTarget.value })
        setReport(r);
    }

    const getPrettyName = (parameterName: string) => {
        var result = parameterName;
        switch (parameterName) {
            case "week": result = "Week"; break;
        }
        return result;
    }

    const getControl = (v: ReportValueInterface) => {
        var result = null;
        switch (v.key) {
            case "week":
                result = <FormControl type="date" name={v.key} value={Helper.formatHtml5Date(v.value)} onChange={handleChange} onKeyDown={handleKeyDown} />;
                break;
        }
        return result;
    }

    const getParameters = () => {
        const result: JSX.Element[] = [];
        report.values.forEach(v => {
            if (v.key !== "churchId") result.push(
                <FormGroup>
                    <FormLabel>{getPrettyName(v.key)}</FormLabel>
                    {getControl(v)}
                </FormGroup>
            );
        });

        return result;

    }

    React.useEffect(() => { setReport(props.report) }, [props.report]);

    console.log(report);
    if (report?.values?.length > 1) return (
        <InputBox headerIcon="far fa-chart-bar" headerText="Filter Report" saveFunction={handleUpdate} saveText="Update" >
            {getParameters()}
        </InputBox>
    );
    else return null;
}
