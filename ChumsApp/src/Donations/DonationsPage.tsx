import React from 'react';
import { ApiHelper, DisplayBox, BatchEdit, DonationBatchInterface, Helper, Funds, DonationChart, UserHelper, DonationFilter, ExportLink, ReportInterface, ReportHelper, ReportValueInterface } from './Components';
import { Link } from 'react-router-dom';
import { set } from 'date-fns'
import { Row, Col, Table } from 'react-bootstrap';
import { ReportView, ReportFilter } from "../Reports/Components";

export const DonationsPage = () => {
    const [editBatchId, setEditBatchId] = React.useState(-1);
    const [batches, setBatches] = React.useState<DonationBatchInterface[]>([]);
    //const [startDate, setStartDate] = React.useState<Date>(new Date());
    //const [endDate, setEndDate] = React.useState<Date>(new Date());
    const [report, setReport] = React.useState({} as ReportInterface);

    const loadReport = () => {
        ApiHelper.apiGet('/reports/keyName/donationSummary').then(data => {
            var r: ReportInterface = data;
            ReportHelper.setDefaultValues(r);
            setReport(r);
        });
    }

    const runReport = (r: ReportInterface) => {
        const postData = [{ id: r.id, values: r.values }]
        ApiHelper.apiPost('/reports/run', postData).then(data => setReport(data[0]));
    }

    const handleFilterUpdate = (values: ReportValueInterface[]) => {
        var r = { ...report };
        r.values = values;
        runReport(r);
    }


    const showAddBatch = (e: React.MouseEvent) => { e.preventDefault(); setEditBatchId(0); }
    const showEditBatch = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var id = parseInt(anchor.getAttribute('data-id'));
        setEditBatchId(id);
    }
    const batchUpdated = () => { setEditBatchId(-1); loadData(); }
    const loadData = () => {
        ApiHelper.apiGet('/donationbatches').then(data => setBatches(data));
        loadReport();
    }
    const getEditContent = () => {
        return (UserHelper.checkAccess('Donations', 'Edit')) ? (<><ExportLink data={batches} spaceAfter={true} filename="donationbatches.csv" /><a href="about:blank" onClick={showAddBatch} ><i className="fas fa-plus"></i></a></>) : null;
    }
    //const handleFilterUpdate = (startDate: Date, endDate: Date) => { setStartDate(startDate); setEndDate(endDate); }

    const getSidebarModules = () => {
        var result = [];
        //result.push(<DonationFilter startDate={startDate} endDate={endDate} updateFunction={handleFilterUpdate} />);
        result.push(<ReportFilter report={report} updateFunction={handleFilterUpdate} />);
        if (editBatchId > -1) result.push(<BatchEdit batchId={editBatchId} updatedFunction={batchUpdated} />)
        result.push(<Funds />);
        return result;
    }

    const getRows = () => {
        var result: React.ReactNode[] = [];
        var canEdit = UserHelper.checkAccess('Donations', 'Edit');
        var canViewBatcht = UserHelper.checkAccess('Donations', 'View');
        for (let i = 0; i < batches.length; i++) {
            var b = batches[i];
            const editLink = (canEdit) ? (<a href="about:blank" data-id={b.id} onClick={showEditBatch}><i className="fas fa-pencil-alt" /></a>) : null;
            const batchLink = (canViewBatcht) ? (<Link to={"/donations/" + b.id}>{b.id}</Link>) : <>{b.id}</>;
            result.push(<tr>
                <td>{batchLink}</td>
                <td>{b.name}</td>
                <td>{Helper.prettyDate(b.batchDate)}</td>
                <td>{b.donationCount}</td>
                <td>{Helper.formatCurrency(b.totalAmount)}</td>
                <td>{editLink}</td>
            </tr>);
        }
        return result;
    }

    React.useEffect(loadData, []);
    //React.useEffect(() => { setStartDate(set(new Date(), { month: 0, date: 1, hours: 0, minutes: 0, seconds: 0 })); }, []);

    if (!UserHelper.checkAccess('Donations', 'View Summary')) return (<></>);
    else return (
        <form method="post">
            <h1><i className="fas fa-hand-holding-usd"></i> Donations</h1>
            <Row>
                <Col lg={8}>
                    <ReportView report={report} />
                    <DisplayBox id="batchesBox" headerIcon="fas fa-hand-holding-usd" headerText="Batches" editContent={getEditContent()}  >
                        <Table>
                            <tbody>
                                <tr><th>Id</th><th>Name</th><th>Date</th><th>Donations</th><th>Total</th><th>Edit</th></tr>
                                {getRows()}
                            </tbody>
                        </Table>
                    </DisplayBox >
                </Col>
                <Col lg={4}>{getSidebarModules()}</Col>
            </Row>

        </form >
    );
}

