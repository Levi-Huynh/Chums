import React from 'react';
import { ApiHelper, DisplayBox, InputBox, DonationBatchInterface, Helper, UserHelper, FundDonationInterface, ExportLink } from './Components';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Row, Col, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

type TParams = { id?: string };

export const FundPage = ({ match }: RouteComponentProps<TParams>) => {
    var initialDate = new Date();
    initialDate.setDate(initialDate.getDate() - 7);

    const [fund, setFund] = React.useState<DonationBatchInterface>({});
    const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);
    const [startDate, setStartDate] = React.useState<Date>(initialDate);
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const getEditContent = () => { return (<ExportLink data={fundDonations} spaceAfter={true} />) }

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
            var personCol = (fd.donation?.personId === 0) ? (<td>Anonymous</td>)
                : (<td><Link to={"/people/" + fd.donation?.personId}>{fd.donation.person?.displayName || 'Anonymous'}</Link></td>);
            result.push(<tr>
                <td>{Helper.formatHtml5Date(fd.donation.donationDate)}</td>
                <td><Link to={"/donations/" + fd.donation.batchId}>{fd.donation.batchId}</Link></td>
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
            <Row>
                <Col lg={8}>
                    <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Donations" editContent={getEditContent()}>
                        <table className="table">
                            <tr><th>Date</th><th>Batch</th><th>Donor</th><th>Amount</th></tr>
                            {getRows()}
                        </table>
                    </DisplayBox>
                </Col>
                <Col lg={4}>
                    <InputBox headerIcon="fas fa-filter" headerText="Donation Filter" saveFunction={loadDonations} saveText="Filter" >
                        <FormGroup>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl name="startDate" type="date" value={Helper.formatHtml5Date(startDate)} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>End Date</FormLabel>
                            <FormControl name="endDate" type="date" value={Helper.formatHtml5Date(endDate)} onChange={handleChange} />
                        </FormGroup>
                    </InputBox >
                </Col>
            </Row >

        </>
    );
}

