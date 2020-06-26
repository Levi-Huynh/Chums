import React from 'react';
import { FundDonationInterface, FundInterface } from './';

interface Props {
    fundDonation: FundDonationInterface,
    funds: FundInterface[],
    index: number,
    updatedFunction: (fundDonation: FundDonationInterface, index: number) => void
}

export const FundDonation: React.FC<Props> = (props) => {

    const getOptions = () => {
        var result = [];
        for (let i = 0; i < props.funds.length; i++) result.push(<option value={props.funds[i].id}>{props.funds[i].name}</option>);
        return result;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        var fd = { ...props.fundDonation }
        switch (e.target.name) {
            case 'amount':
                fd.amount = parseFloat(e.target.value.replace('$', '').replace(',', ''));
                break;
            case 'fund':
                fd.fundId = parseInt(e.target.value);
                break;
        }
        props.updatedFunction(fd, props.index);
    }

    return (
        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label>Amount</label>
                    <input name="amount" type="number" lang="en-150" min="0.00" step="0.01" className="form-control" value={props.fundDonation.amount} onChange={handleChange} />
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label>Fund</label>
                    <select name='fund' className="form-control" value={props.fundDonation.fundId} onChange={handleChange}>
                        {getOptions()}
                    </select>
                </div>
            </div>
        </div>
    );
}

