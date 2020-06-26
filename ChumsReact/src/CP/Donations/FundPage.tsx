import React from 'react';
import { ApiHelper, DisplayBox, InputBox, DonationBatchInterface, Helper, UserHelper, FundDonationInterface } from './Components';
import { RouteComponentProps, Link } from 'react-router-dom';


type TParams = { id?: string };

export const FundPage = ({ match }: RouteComponentProps<TParams>) => {
    var initialDate = new Date();
    initialDate.setDate(initialDate.getDate() - 7);

    const [fund, setFund] = React.useState<DonationBatchInterface>({});
    const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);
    const [startDate, setStartDate] = React.useState<Date>(initialDate);
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const loadData = () => {
        ApiHelper.apiGet('/funds/' + match.params.id).then(data => setFund(data));
        loadDonations();
    }

    const loadDonations = () => {
        ApiHelper.apiGet('/funddonations?fundId=' + match.params.id + '&startDate=' + Helper.formatHtml5Date(startDate) + '&endDate=' + Helper.formatHtml5Date(endDate))
            .then(data => { setFundDonations(data) });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case "startDate":
                setStartDate(new Date(e.target.value));
                break;
            case "endDate":
                setEndDate(new Date(e.target.value));
                break;
        }
    }

    const getRows = () => {
        var result = [];
        for (let i = 0; i < fundDonations.length; i++) {
            var fd = fundDonations[i];
            var personCol = (fd.donation?.personId == 0) ? (<td>Anonymous</td>)
                : (<td><Link to={"/cp/people/" + fd.donation?.personId}>{fd.donation.person?.displayName || 'Anonymous'}</Link></td>);
            result.push(<tr>
                <td>{Helper.formatHtml5Date(fd.donation.donationDate)}</td>
                <td><Link to={"/cp/donations/" + fd.donation.batchId}>{fd.donation.batchId}</Link></td>
                {personCol}
                <td>{Helper.formatCurrency(fd.amount)}</td>
            </tr>);

        }
        return result;
    }


    React.useEffect(loadData, [match.params.id]);

    if (!UserHelper.checkAccess('Donations', 'View')) return (<></>);
    else return (
        <>
            <h1><i className="fas fa-hand-holding-usd"></i> {fund.name} Donations</h1>
            <div className="row">
                <div className="col-lg-8">
                    <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Donations">
                        <table className="table">
                            <tr><th>Date</th><th>Batch</th><th>Donor</th><th>Amount</th></tr>
                            {getRows()}
                        </table>
                    </DisplayBox>

                </div >
                <div className="col-lg-4">
                    <InputBox headerIcon="fas fa-filter" headerText="Donation Filter" saveFunction={loadDonations} saveText="Filter" >
                        <div className="form-group">
                            <label>Start Date</label>
                            <input name="startDate" type="date" className="form-control" value={Helper.formatHtml5Date(startDate)} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" className="form-control" value={Helper.formatHtml5Date(endDate)} />
                        </div>
                    </InputBox >
                </div>
            </div >

        </>
    );
}

