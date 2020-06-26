import React from 'react';
import { ApiHelper, UserHelper, DonationInterface, Helper, DisplayBox } from './';

interface Props { batchId: number, addFunction: () => void, editFunction: (id: number) => void }

export const Donations: React.FC<Props> = (props) => {
    const [donations, setDonations] = React.useState<DonationInterface[]>([]);

    const loadData = () => ApiHelper.apiGet('/donations?batchId=' + props.batchId).then(data => setDonations(data));
    const showAddDonation = (e: React.MouseEvent) => { e.preventDefault(); props.addFunction() }
    const getEditContent = () => { return (UserHelper.checkAccess('Donations', 'Edit')) ? (<a href="about:blank" onClick={showAddDonation} ><i className="fas fa-plus"></i></a>) : null; }
    const showEditDonation = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var id = parseInt(anchor.getAttribute('data-id'));
        props.editFunction(id);
    }

    const getRows = () => {
        var rows: React.ReactNode[] = [];
        var canEdit = UserHelper.checkAccess('Donations', 'Edit');
        for (let i = 0; i < donations.length; i++) {
            var d = donations[i];
            const editLink = (canEdit) ? (<a href="about:blank" onClick={showEditDonation} data-id={d.id}>{d.id}</a>) : (<>{d.id}</>);
            rows.push(<tr>
                <td>{editLink}</td>
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

