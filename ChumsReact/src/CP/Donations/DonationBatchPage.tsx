import React from 'react';
import { ApiHelper, DisplayBox, DonationEdit, DonationBatchInterface, Helper, Donations, FundInterface } from './Components';
import { RouteComponentProps } from 'react-router-dom';

type TParams = { id?: string };

export const DonationBatchPage = ({ match }: RouteComponentProps<TParams>) => {
    const [editDonationId, setEditDonationId] = React.useState(-1);
    const [batch, setBatch] = React.useState<DonationBatchInterface>({});
    const [funds, setFunds] = React.useState<FundInterface[]>([]);

    const showAddDonation = () => { setEditDonationId(0); }
    const loadData = () => {
        ApiHelper.apiGet('/donationbatches/' + match.params.id).then(data => setBatch(data));
        ApiHelper.apiGet('/funds').then(data => setFunds(data));
    }
    const donationUpdated = () => { setEditDonationId(-1); loadData(); }

    const getSidebarModules = () => {
        var result = [];
        if (editDonationId > -1) result.push(<DonationEdit donationId={editDonationId} updatedFunction={donationUpdated} funds={funds} />)
        return result;
    }

    React.useEffect(() => loadData(), [match.params.id]);

    return (
        <form method="post">
            <h1><i className="fas fa-hand-holding-usd"></i> Batch #</h1>
            <div className="row">
                <div className="col-lg-8">
                    <Donations batchId={parseInt(match.params.id)} addFunction={showAddDonation} />

                </div >
                <div className="col-lg-4">
                    {getSidebarModules()}
                </div>
            </div >

        </form >
    );
}

