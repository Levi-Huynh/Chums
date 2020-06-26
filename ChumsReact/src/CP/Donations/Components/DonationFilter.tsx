import React from 'react';
import { InputBox, Helper } from './';

export const DonationFilter: React.FC = () => {
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());
    const handleSave = () => { }

    React.useEffect(() => {
        var initialDate = new Date();
        initialDate.setDate(initialDate.getDate() - 7);
        setStartDate(initialDate);
    }, []);

    return (<InputBox headerIcon="fas fa-filter" headerText="Donation Filter" saveFunction={handleSave} saveText="Filter" >
        <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="form-control" value={Helper.formatHtml5Date(startDate)} />
        </div>
        <div className="form-group">
            <label>End Date</label>
            <input type="date" className="form-control" value={Helper.formatHtml5Date(endDate)} />
        </div>
    </InputBox >);


}

