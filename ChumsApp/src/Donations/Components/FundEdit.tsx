import React from 'react';
import { ApiHelper, InputBox, FundInterface } from './';

interface Props { fund: FundInterface, updatedFunction: () => void }
export const FundEdit: React.FC<Props> = (props) => {
    const [fund, setFund] = React.useState<FundInterface>({ id: 0, name: '' });


    const handleCancel = () => props.updatedFunction();
    const handleSave = () => ApiHelper.apiPost('/funds', [fund]).then(() => props.updatedFunction());
    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to permanently delete this fund?')) {
            ApiHelper.apiDelete('/funds/' + fund.id).then(() => props.updatedFunction());
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var f = { ...fund };
        f.name = e.target.value;
        setFund(f);
    }

    React.useEffect(() => { setFund(props.fund); }, [props.fund]);


    return (
        <InputBox headerIcon="fas fa-hand-holding-usd" headerText="Edit Fund" cancelFunction={handleCancel} saveFunction={handleSave} deleteFunction={(fund.id === 0) ? undefined : handleDelete} >
            <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={fund.name} onChange={handleChange} />
            </div>
        </InputBox >

    );
}

