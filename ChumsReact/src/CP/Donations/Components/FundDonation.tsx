import React from 'react';
import { ApiHelper, InputBox, FundDonationInterface, FundInterface } from './';
import { Link } from 'react-router-dom';


interface Props { fundDonation: FundDonationInterface, funds: FundInterface[], updatedFunction?: () => void }

export const FundDonation: React.FC<Props> = (props) => {
    const [fundDonation, setFundDonation] = React.useState<FundDonationInterface>({});
    return (
        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label>Amount</label>
                    <input type="text" className="form-control" />
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label>Fund</label>
                    <select className="form-control">

                    </select>
                </div>
            </div>
        </div>
    );
}

