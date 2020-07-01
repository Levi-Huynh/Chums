import React from 'react';
import { ApiHelper, DisplayBox, BatchEdit, DonationBatchInterface, Helper, Funds, DonationChart, UserHelper, DonationFilter } from './Components';
import { Link } from 'react-router-dom';
import { set } from 'date-fns'

export const DonationsPage = () => {
    const [editBatchId, setEditBatchId] = React.useState(-1);
    const [batches, setBatches] = React.useState<DonationBatchInterface[]>([]);
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const showAddBatch = (e: React.MouseEvent) => { e.preventDefault(); setEditBatchId(0); }
    const showEditBatch = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var id = parseInt(anchor.getAttribute('data-id'));
        setEditBatchId(id);
    }
    const batchUpdated = () => { setEditBatchId(-1); loadData(); }
    const loadData = () => { ApiHelper.apiGet('/donationbatches').then(data => setBatches(data)); }
    const getEditContent = () => { return (UserHelper.checkAccess('Donations', 'Edit')) ? (<a href="about:blank" onClick={showAddBatch} ><i className="fas fa-plus"></i></a>) : null; }
    const handleFilterUpdate = (startDate: Date, endDate: Date) => { setStartDate(startDate); setEndDate(endDate); }

    const getSidebarModules = () => {
        var result = [];
        result.push(<DonationFilter startDate={startDate} endDate={endDate} updateFunction={handleFilterUpdate} />);
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
    React.useEffect(() => { setStartDate(set(new Date(), { month: 0, date: 1, hours: 0, minutes: 0, seconds: 0 })); }, []);

    if (!UserHelper.checkAccess('Donations', 'View Summary')) return (<></>);
    else return (
        <form method="post">
            <h1><i className="fas fa-hand-holding-usd"></i> Donations</h1>
            <div className="row">
                <div className="col-lg-8">
                    <DonationChart startDate={startDate} endDate={endDate} />
                    <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Batches" editContent={getEditContent()}  >
                        <table className="table">
                            <tbody>
                                <tr><th>Id</th><th>Name</th><th>Date</th><th>Donations</th><th>Total</th><th>Edit</th></tr>
                                {getRows()}
                            </tbody>
                        </table>
                    </DisplayBox >
                </div >
                <div className="col-lg-4">
                    {getSidebarModules()}
                </div>
            </div >

        </form >
    );
}

