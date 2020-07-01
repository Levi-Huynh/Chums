import React from 'react';
import { ApiHelper, FundInterface, FundEdit, DisplayBox, UserHelper } from './';
import { Link } from 'react-router-dom';

export const Funds: React.FC = () => {
    const [funds, setFunds] = React.useState<FundInterface[]>([]);
    const [editFund, setEditFund] = React.useState<FundInterface>(null);

    const loadData = () => ApiHelper.apiGet('/funds').then(data => setFunds(data));
    const handleFundUpdated = () => { loadData(); setEditFund(null); }
    const getEditSection = () => {
        if (UserHelper.checkAccess('Donations', 'Edit')) return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditFund({ id: 0, name: '' }) }}><i className="fas fa-plus"></i></a>);
        else return null;
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        setEditFund(funds[idx]);
    }

    const getRows = () => {
        var result = [];
        var canEdit = UserHelper.checkAccess('Donations', 'Edit');
        var canViewIndividual = UserHelper.checkAccess('Donations', 'View');
        for (let i = 0; i < funds.length; i++) {
            var f = funds[i];
            const editLink = (canEdit) ? (<a href="about:blank" onClick={handleEdit} data-index={i}><i className="fas fa-pencil-alt"></i></a>) : null;
            const viewLink = (canViewIndividual) ? (<Link to={"/donations/funds/" + f.id}>{f.name}</Link>) : (<>{f.name}</>);
            result.push(<tr>
                <td>{viewLink}</td>
                <td className="text-right">{editLink}</td>
            </tr >)
        }
        return result;
    }

    React.useEffect(() => { loadData(); }, []);

    if (editFund === null) return (
        <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Funds" editContent={getEditSection()} >
            <table className="table table-sm">
                {getRows()}
            </table >
        </DisplayBox >
    );
    else return (<FundEdit fund={editFund} updatedFunction={handleFundUpdated} />);

}

