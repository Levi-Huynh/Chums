import React from 'react';
import { ApiHelper, DisplayBox, ReportInterface } from './';
import { Link } from 'react-router-dom';

export const ReportList = () => {
    const [reports, setReports] = React.useState<ReportInterface[]>(null);

    const loadData = () => { ApiHelper.apiGet('/reports').then(data => setReports(data)); }

    const getRows = () => {
        if (reports === null) return null;
        else {
            const result: JSX.Element[] = [];
            reports.forEach(r => {
                result.push(<tr><td><Link to={"/reports/" + r.id}>{r.title}</Link></td></tr>)
            });
            return result;
        }
    }

    React.useEffect(loadData, []);



    return (
        <DisplayBox headerIcon="far fa-chart-bar" headerText="Reports" >
            <table className="table">
                <tbody>
                    {getRows()}
                </tbody>
            </table>
        </DisplayBox>
    );
}
