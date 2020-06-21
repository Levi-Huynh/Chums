import React from 'react';
import { ApiHelper, InputBox, FundDonationInterface, FundDonation, FundInterface } from './';
import { Link } from 'react-router-dom';


interface Props { fundDonations: FundDonationInterface[], funds: FundInterface[], updatedFunction?: () => void }

export const FundDonations: React.FC<Props> = (props) => {

    //const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);

    /*
        const [donation, setDonation] = React.useState<DonationInterface>({});
        const [showSelectPerson, setShowSelectPerson] = React.useState(false);
    
        //const getEditContent = () => { return (<a href="#"><i className="fas fa-plus"></i></a>); }
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            var d = { ...donation } as DonationInterface;
            var value = e.target.value;
            switch (e.currentTarget.name) {
                case 'notes': d.notes = value; break;
                case 'date': d.donationDate = new Date(value); break;
                case 'method': d.method = value;
                case 'methodDetails': d.methodDetails = value;
            }
            setDonation(d);
        }
    
        const handleCancel = () => { props.updatedFunction(); }
        const handleDelete = () => { props.updatedFunction(); }
        const handleSave = () => ApiHelper.apiPost('/donations', [donation]).then(() => props.updatedFunction());
        const getDeleteFunction = () => { return (props.donationId > 0) ? handleDelete : undefined; }
        const loadData = () => {
            if (props.donationId === 0) setDonation({ donationDate: new Date() });
            else ApiHelper.apiGet('/donations/' + props.donationId).then(data => setDonation(data));
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
            if (p == null) {
                d.person = null;
                d.personId = 0;
            } else {
                d.person = p;
                d.personId = p.id;
            }
            setDonation(d);
            setShowSelectPerson(false);
        }
    
        const getPersonSection = () => {
            if (showSelectPerson) return (<>
                <PersonAdd addFunction={handlePersonAdd} />
                <hr />
                <a href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handlePersonAdd(null); }}>None</a>
            </>
            );
            else {
                var personText = (donation.person === undefined || donation.person === null) ? ('None') : donation.person.displayName;
                return (<div>
                    <a href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setShowSelectPerson(true); }}>{personText}</a>
                </div>);
            }
        }
    
        React.useEffect(loadData, [props.donationId]);
    */

    const getRows = () => {
        var result = [];
        for (let i = 0; i < props.fundDonations.length; i++) {
            var fd = props.fundDonations[i];
            result.push(<FundDonation fundDonation={fd} funds={props.funds} />)
        }

        return result;
    }

    return (
        <>
            {getRows()}
            <a href="#">Add row</a>
        </>
    );
}

