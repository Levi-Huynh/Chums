import React from 'react';
import { ApiHelper, InputBox, DonationInterface, FundDonationInterface, PersonAdd, FundInterface, FundDonations, Helper, PersonInterface } from './';


interface Props { donationId: number, batchId: number, funds: FundInterface[], updatedFunction: () => void }

export const DonationEdit: React.FC<Props> = (props) => {

    const [donation, setDonation] = React.useState<DonationInterface>({});
    const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);
    const [showSelectPerson, setShowSelectPerson] = React.useState(false);

    //const getEditContent = () => { return (<a href="about:blank"><i className="fas fa-plus"></i></a>); }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        var d = { ...donation } as DonationInterface;
        var value = e.target.value;
        switch (e.currentTarget.name) {
            case 'notes': d.notes = value; break;
            case 'date': d.donationDate = new Date(value); break;
            case 'method': d.method = value; break;
            case 'methodDetails': d.methodDetails = value; break;
        }
        setDonation(d);
    }

    const handleCancel = () => { props.updatedFunction(); }
    const handleDelete = () => { ApiHelper.apiDelete('/donations/' + donation.id).then(() => { props.updatedFunction() }); }
    const getDeleteFunction = () => { return (props.donationId > 0) ? handleDelete : undefined; }

    const handleSave = () => {
        ApiHelper.apiPost('/donations', [donation]).then(data => {
            var id = parseInt(data[0]);
            var promises = [];
            var fDonations = [...fundDonations];
            for (let i = fDonations.length - 1; i >= 0; i--) {
                var fd = fundDonations[i];
                if (fd.amount === undefined || fd.amount === 0) {
                    if (fd.id > 0) promises.push(ApiHelper.apiDelete('/funddonations/' + fd.id));
                    fDonations.splice(i, 1);
                } else (fd.donationId = id)
            }
            if (fDonations.length > 0) promises.push(ApiHelper.apiPost('/funddonations', fDonations));
            Promise.all(promises).then(() => props.updatedFunction());
        });
    }

    const loadData = () => {
        if (props.donationId === 0) {
            setDonation({ donationDate: new Date(), batchId: props.batchId, amount: 0, method: 'Cash' });
            var fd: FundDonationInterface = { amount: 0, fundId: props.funds[0].id };
            setFundDonations([fd]);
        }
        else {
            ApiHelper.apiGet('/donations/' + props.donationId + '?include=person').then(data => setDonation(data));
            ApiHelper.apiGet('/funddonations?donationId=' + props.donationId).then(data => setFundDonations(data));
        }
    }

    const getMethodDetails = () => {
        if (donation.method === 'Cash') return null;
        var label = (donation.method === 'Check') ? 'Check #' : 'Last 4 digits';
        return (<div className="form-group">
            <label>{label}</label>
            <input type="text" className="form-control" name="methodDetails" value={donation.methodDetails} onChange={handleChange} />
        </div>);
    }

    const handlePersonAdd = (p: PersonInterface) => {
        var d = { ...donation } as DonationInterface;
        if (p === null) {
            d.person = null;
            d.personId = 0;
        } else {
            d.person = p;
            d.personId = p.id;
        }
        setDonation(d);
        setShowSelectPerson(false);
    }

    const handleFundDonationsChange = (fd: FundDonationInterface[]) => {
        setFundDonations(fd);
        var totalAmount = 0;
        for (let i = 0; i < fundDonations.length; i++) totalAmount += fd[i].amount;
        if (totalAmount !== donation.amount) {
            var d = { ...donation };
            d.amount = totalAmount;
            setDonation(d);
        }
    }

    const getPersonSection = () => {
        if (showSelectPerson) return (<>
            <PersonAdd addFunction={handlePersonAdd} />
            <hr />
            <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); handlePersonAdd(null); }}>Anonymous</a>
        </>
        );
        else {
            var personText = (donation.person === undefined || donation.person === null) ? ('Anonymous') : donation.person.displayName;
            return (<div>
                <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setShowSelectPerson(true); }}>{personText}</a>
            </div>);
        }
    }

    React.useEffect(loadData, [props.donationId]);

    return (
        <InputBox id="donationBox" headerIcon="fas fa-hand-holding-usd" headerText="Edit Donation" cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} saveFunction={handleSave} >
            <div className="form-group">
                <label>Person</label>
                {getPersonSection()}
            </div>
            <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" name='date' value={Helper.formatHtml5Date(donation.donationDate)} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Method</label>
                <select name="method" className="form-control" value={donation.method} onChange={handleChange}>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                </select>
            </div>
            {getMethodDetails()}
            <FundDonations fundDonations={fundDonations} funds={props.funds} updatedFunction={handleFundDonationsChange} />
            <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" name="notes" value={donation.notes} onChange={handleChange}></textarea>
            </div>
        </InputBox >
    );
}

