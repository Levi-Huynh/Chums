import React from 'react';
import { ApiHelper, ReportInterface } from './';
import { InputBox, ReportValueInterface, Helper, ServiceInterface } from './';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';

interface Props { report?: ReportInterface, updateFunction: (values: ReportValueInterface[]) => void }

export const ReportFilter = (props: Props) => {
    const [report, setReport] = React.useState<ReportInterface>(null);
    const [services, setServices] = React.useState<ServiceInterface[]>(null);

    const loadServices = () => { ApiHelper.apiGet("/services").then(data => setServices(data)); }
    const handleUpdate = () => { props.updateFunction(report.values); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdate(); } }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        var r = { ...report };
        r.values.forEach(v => { if (v.key === e.currentTarget.name) v.value = e.currentTarget.value })
        setReport(r);
    }

    const getServiceOptions = () => {
        var result: JSX.Element[] = [];
        if (services !== null) {
            services.forEach(s => {
                result.push(<option value={s.id}>{s.name}</option>)
            });
        }
        return result;
    }

    const getPrettyName = (parameterName: string) => {
        var result = parameterName;
        switch (parameterName) {
            case "week": result = "Week"; break;
            case "serviceId": result = "Service"; break;
        }
        return result;
    }

    const getControl = (v: ReportValueInterface) => {
        var result = null;
        switch (v.key) {
            case "week":
                result = <FormControl type="date" name={v.key} value={Helper.formatHtml5Date(v.value)} onChange={handleChange} onKeyDown={handleKeyDown} />;
                break;
            case "serviceId":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getServiceOptions()}</FormControl>);
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

    React.useEffect(() => {
        if (props.report?.values !== undefined && props.report?.values !== null) {
            props.report.values.forEach(v => {
                switch (v.key) {
                    case "serviceId":
                        if (services === null) loadServices();
                        break;
                }
            });
            setReport(props.report);
        }
    }, [props.report]);// eslint-disable-line react-hooks/exhaustive-deps

    console.log(report);
    if (report?.values?.length > 1) return (
        <InputBox headerIcon="far fa-chart-bar" headerText="Filter Report" saveFunction={handleUpdate} saveText="Update" >
            {getParameters()}
        </InputBox>
    );
    else return null;
}
