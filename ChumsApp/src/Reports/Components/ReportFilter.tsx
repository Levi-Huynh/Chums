import React from 'react';
import { ApiHelper, ReportInterface } from './';
import { InputBox, ReportValueInterface, Helper, ServiceInterface, ServiceTimeInterface, GroupInterface, ReportHelper } from './';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { CampusInterface, FundInterface } from '../../Utils';
import { getLineAndCharacterOfPosition } from 'typescript';

interface Props { report?: ReportInterface, updateFunction: (values: ReportValueInterface[]) => void }

export const ReportFilter = (props: Props) => {

    //var _report: ReportInterface; //I'm not sure this is a good way to handle this.  "report" isn't updated immediately after change and I need to trigger handleUpdate immdiately sometimes.

    var [pendingRun, setPendingRun] = React.useState(false);
    const [report, setReport] = React.useState<ReportInterface>(null);
    const [campuses, setCampuses] = React.useState<CampusInterface[]>(null);
    const [services, setServices] = React.useState<ServiceInterface[]>(null);
    const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>(null);
    const [groups, setGroups] = React.useState<GroupInterface[]>(null);
    const [funds, setFunds] = React.useState<FundInterface[]>(null);

    const handleUpdate = () => { props.updateFunction(report.values); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdate(); } }


    const loadCampuses = () => {
        ApiHelper.apiGet("/campuses").then(data => {
            var c: CampusInterface[] = data;
            c.unshift({ id: 0, name: "Any" });
            setCampuses(c);
        });
    }

    const loadServices = () => {
        ApiHelper.apiGet("/services").then(data => {
            var s: ServiceInterface[] = data;
            s.unshift({ id: 0, campusId: 0, name: "Any" });
            setServices(s);
        });
    }

    const loadServiceTimes = () => {
        ApiHelper.apiGet("/serviceTimes").then(data => {
            var st: ServiceTimeInterface[] = data;
            st.unshift({ id: 0, serviceId: 0, name: "Any", longName: "Any" });
            setServiceTimes(st);
        });
    }

    const loadGroups = () => {
        ApiHelper.apiGet("/groups").then(data => {
            var g: GroupInterface[] = data;
            g.unshift({ id: 0, name: "Any", categoryName: "Any" });
            setGroups(g);
        });
    }

    const loadFunds = () => {
        ApiHelper.apiGet("/funds").then(data => {
            var f: FundInterface[] = data;
            f.unshift({ id: 0, name: "Any" });
            setFunds(data);
        });
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const _report = { ...report };
        setValue(e.currentTarget.name, e.currentTarget.value);
    }

    const setValue = (key: string, value: any) => {
        const _report = { ...report };
        _report.values.forEach(v => { if (v.key === key) v.value = value });
        setReport(_report);
    }

    /*
        const hasKey = (key: string) => {
            var result = false;
            _report.values.forEach(v => { if (v.key === key) result = true });
            return result;
        }
    
        const getValue = (key: string) => {
            var result: string = null;
            _report.values.forEach(v => { if (v.key === key) result = v.value.toString() });
            return result;
        }
    */
    const getCampusOptions = () => {
        var result: JSX.Element[] = [];
        if (campuses !== null) campuses.forEach(c => { result.push(<option value={c.id}>{c.name}</option>) });
        return result;
    }

    const getServiceOptions = () => {
        var result: JSX.Element[] = [];
        if (services !== null) services.forEach(s => { result.push(<option value={s.id}>{s.name}</option>) });
        return result;
    }

    const getServiceTimeOptions = () => {
        var result: JSX.Element[] = [];
        if (serviceTimes !== null) serviceTimes.forEach(st => { result.push(<option value={st.id}>{st.longName}</option>) });
        return result;
    }

    const getGroupCategoryOptions = () => {
        var categories: string[] = [];
        if (groups !== null) groups.forEach(g => { if (categories.indexOf(g.categoryName) == -1) categories.push(g.categoryName) });

        var result: JSX.Element[] = [];
        categories.forEach(c => {
            if (c === "Any") result.push(<option value={""}>{c}</option>)
            else result.push(<option value={c}>{c}</option>)
        });

        return result;
    }


    const getGroupOptions = () => {
        var result: JSX.Element[] = [];
        if (groups !== null) groups.forEach(g => { result.push(<option value={g.id}>{g.name}</option>) });
        return result;
    }

    const getFundOptions = () => {
        var result: JSX.Element[] = [];
        if (funds !== null) funds.forEach(f => { result.push(<option value={f.id}>{f.name}</option>) });
        return result;
    }


    const getControl = (v: ReportValueInterface) => {
        var result = null;
        switch (v.key) {
            case "week":
            case "startDate":
            case "endDate":
                result = <FormControl type="date" name={v.key} value={Helper.formatHtml5Date(v.value)} onChange={handleChange} onKeyDown={handleKeyDown} />;
                break;
            case "campusId":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getCampusOptions()}</FormControl>);
                break;
            case "serviceId":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getServiceOptions()}</FormControl>);
                break;
            case "serviceTimeId":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getServiceTimeOptions()}</FormControl>);
                break;
            case "groupCategory":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getGroupCategoryOptions()}</FormControl>);
                break;
            case "groupId":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getGroupOptions()}</FormControl>);
                break;
            case "fundId":
                result = (<FormControl as="select" name={v.key} onChange={handleChange} onKeyDown={handleKeyDown} >{getFundOptions()}</FormControl>);
                break;
        }
        return result;
    }

    const getParameters = () => {
        const result: JSX.Element[] = [];
        const existing: string[] = [];
        report.values.forEach(v => {
            if (v.key !== "churchId" && existing.indexOf(v.key) === -1) {
                result.push(
                    <FormGroup>
                        <FormLabel>{ReportHelper.getPrettyName(v.key)}</FormLabel>
                        {getControl(v)}
                    </FormGroup>
                );
                existing.push(v.key);
            }
        });

        return result;
    }


    const initFilter = () => {
        if (props.report !== null && props.report.id > 0) {
            if (report === undefined || report === null || report.id !== props.report.id) {
                setReport(props.report);
                //_report = props.report;
                if (props.report?.values !== undefined && props.report?.values !== null) {
                    props.report.values.forEach(v => {
                        switch (v.key) {
                            case "campusId":
                                if (campuses === null) loadCampuses();
                                break;
                            case "serviceId":
                                if (services === null) loadServices();
                                break;
                            case "serviceTimeId":
                                if (serviceTimes === null) loadServiceTimes();
                                break;
                            case "groupCategory":
                            case "groupId":
                                if (groups === null) loadGroups();
                                break;
                            case "fundId":
                                if (funds === null) loadFunds();
                                break;
                        }
                    });
                }
                setPendingRun(true);
            }
        }
    }



    React.useEffect(initFilter, [props.report]);
    React.useEffect(() => {
        if (pendingRun) {
            handleUpdate();
            setPendingRun(false);
        }
    }, [pendingRun]);

    if (report?.values?.length > 1) return (
        <InputBox headerIcon="far fa-chart-bar" headerText="Filter Report" saveFunction={handleUpdate} saveText="Update" >
            {getParameters()}
        </InputBox>
    );
    else return null;
}
