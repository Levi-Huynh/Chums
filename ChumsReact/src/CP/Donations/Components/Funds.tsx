import React from 'react';
import { ApiHelper, InputBox, FundDonationInterface, FundInterface, FundEdit } from './';
import { Link } from 'react-router-dom';
import { DisplayBox } from '../../Components';



export const Funds: React.FC = () => {
    const [funds, setFunds] = React.useState<FundInterface[]>([]);
    const [editFund, setEditFund] = React.useState<FundInterface>(null);

    const loadData = () => ApiHelper.apiGet('/funds').then(data => setFunds(data));
    const handleFundUpdated = () => { loadData(); setEditFund(null); }

    const getEditSection = () => { return (<a href="#" onClick={() => setEditFund({ id: 0, name: '' })}><i className="fas fa-plus"></i></a>); }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = parseInt(anchor.getAttribute('data-index'));
        setEditFund(funds[idx]);
    }

    const getRows = () => {
        var result = [];
        for (let i = 0; i < funds.length; i++) {
            var f = funds[i];
            result.push(<tr>
                <td><Link to={"/cp/donations/funds/" + f.id}>{f.name}</Link></td>
                <td className="text-right"><a href="#" onClick={handleEdit} data-index={i}><i className="fas fa-pencil-alt"></i></a></td>
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

