import React from 'react';
import { InputBox, Helper } from './';

interface Props { startDate: Date, endDate: Date, updateFunction: (startDate: Date, endDate: Date) => void }

export const DonationFilter: React.FC<Props> = (props) => {
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());
    const handleFilter = () => { props.updateFunction(startDate, endDate) }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === 'Enter') { e.preventDefault(); handleFilter(); } }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var date = new Date(e.currentTarget.value);
        if (isNaN(date.getTime())) date = null;
        switch (e.currentTarget.name) {
            case 'startDate': setStartDate(date); break;
            case 'endDate': setEndDate(date); break;
        }
    }

    React.useEffect(() => {
        setStartDate(props.startDate);
        setEndDate(props.endDate);
    }, [props.startDate, props.endDate]);

    return (<InputBox id="donationFilterBox" headerIcon="fas fa-filter" headerText="Filter Donation Chart" saveFunction={handleFilter} saveText="Filter" >
        <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="form-control" name="startDate" value={Helper.formatHtml5Date(startDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
        </div>
        <div className="form-group">
            <label>End Date</label>
            <input type="date" className="form-control" name="endDate" value={Helper.formatHtml5Date(endDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
        </div>
    </InputBox >);


}

