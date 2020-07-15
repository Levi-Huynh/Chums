import React from 'react';
import { ApiHelper, InputBox, Helper, DonationBatchInterface } from './';

interface Props { batchId: number, updatedFunction: () => void }

export const BatchEdit: React.FC<Props> = (props) => {
    const [batch, setBatch] = React.useState<DonationBatchInterface>({ batchDate: new Date(), name: '' });

    const handleCancel = () => { props.updatedFunction(); }
    const handleSave = () => ApiHelper.apiPost('/donationbatches', [batch]).then(() => props.updatedFunction());
    const getDeleteFunction = () => { return (props.batchId > 0) ? handleDelete : undefined; }

    const handleDelete = () => {
        if (window.confirm('Are you sure you wish to permanently delete this batch?')) {
            ApiHelper.apiDelete('/donationbatches/' + batch.id).then(() => props.updatedFunction());
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var b = { ...batch } as DonationBatchInterface;
        switch (e.currentTarget.name) {
            case 'name': b.name = e.currentTarget.value; break;
            case 'date':
                b.batchDate = new Date(e.currentTarget.value);
                if (isNaN(b.batchDate.getTime())) b.batchDate = null;
                break;
        }
        setBatch(b);
    }

    const loadData = () => {
        if (props.batchId === 0) setBatch({ batchDate: new Date(), name: '' });
        else ApiHelper.apiGet('/donationbatches/' + props.batchId).then(data => setBatch(data));
    }

    React.useEffect(loadData, [props.batchId]);

    return (
        <InputBox id="batchBox" headerIcon="fas fa-hand-holding-usd" headerText="Edit Batch" cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} saveFunction={handleSave} >
            <div className="form-group">
                <label>Name (optional)</label>
                <input type="text" className="form-control" name='name' value={batch.name} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-control" name='date' value={Helper.formatHtml5Date(batch.batchDate)} onChange={handleChange} />
            </div>
        </InputBox >
    );
}

