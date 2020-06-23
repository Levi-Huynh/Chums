import React from 'react';
import { ApiHelper, InputBox, ErrorMessages, DonationInterface } from './';
import { Link } from 'react-router-dom';
import { Helper } from '../../../Utils';
import { DisplayBox } from '../../Components';
import { queryHelpers } from '@testing-library/react';

interface Props { batchId: number, addFunction: () => void, editFunction: (id: number) => void }

export const Donations: React.FC<Props> = (props) => {

    const [donations, setDonations] = React.useState<DonationInterface[]>([]);

    const loadData = () => ApiHelper.apiGet('/donations?batchId=' + props.batchId).then(data => setDonations(data));
    const showAddDonation = (e: React.MouseEvent) => { e.preventDefault(); props.addFunction() }
    const showEditDonation = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var id = parseInt(anchor.getAttribute('data-id'));
        props.editFunction(id);
    }
    const getEditContent = () => { return (<a href="#" onClick={showAddDonation} ><i className="fas fa-plus"></i></a>); }
    const getRows = () => {
        var rows: React.ReactNode[] = [];
        for (let i = 0; i < donations.length; i++) {
            var d = donations[i];
            rows.push(<tr>
                <td><a href="#" onClick={showEditDonation} data-id={d.id}>{d.id}</a></td>
                <td>{d.person?.displayName || 'Anonymous'}</td>
                <td>{Helper.formatHtml5Date(d.donationDate)}</td>
                <td>{Helper.formatCurrency(d.amount)}</td>
            </tr>);
        }
        return rows;
    }

    React.useEffect(() => { if (props.batchId > 0) loadData() }, [props.batchId]);

    return (
        <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Donations" editContent={getEditContent()} >
            <table className="table">
                <tbody>
                    <tr><th>Id</th><th>Name</th><th>Date</th><th>Amount</th></tr>
                    {getRows()}
                </tbody>
            </table>

        </DisplayBox >
    );
}

