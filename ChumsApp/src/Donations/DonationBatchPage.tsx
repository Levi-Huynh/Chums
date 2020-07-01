import React from 'react';
import { ApiHelper, DonationEdit, DonationBatchInterface, UserHelper, Donations, FundInterface } from './Components';
import { RouteComponentProps } from 'react-router-dom';

type TParams = { id?: string };

export const DonationBatchPage = ({ match }: RouteComponentProps<TParams>) => {
    const [editDonationId, setEditDonationId] = React.useState(-1);
    const [batch, setBatch] = React.useState<DonationBatchInterface>({});
    const [funds, setFunds] = React.useState<FundInterface[]>([]);

    const showAddDonation = () => { setEditDonationId(0); }
    const showEditDonation = (id: number) => { setEditDonationId(id); }
    const donationUpdated = () => { setEditDonationId(-1); loadData(); }

    const loadData = () => {
        ApiHelper.apiGet('/donationbatches/' + match.params.id).then(data => setBatch(data));
        ApiHelper.apiGet('/funds').then(data => setFunds(data));
    }

    const getSidebarModules = () => {
        var result = [];
        if (editDonationId > -1) result.push(<DonationEdit donationId={editDonationId} updatedFunction={donationUpdated} funds={funds} batchId={batch.id} />)
        return result;
    }

    React.useEffect(loadData, [match.params.id]);

    if (!UserHelper.checkAccess('Donations', 'View')) return (<></>);
    return (
        <>
            <h1><i className="fas fa-hand-holding-usd"></i> Batch #{batch.id}</h1>
            <div className="row">
                <div className="col-lg-8">
                    <Donations batch={batch} addFunction={showAddDonation} editFunction={showEditDonation} />
                </div >
                <div className="col-lg-4">
                    {getSidebarModules()}
                </div>
            </div >

        </>
    );
}

