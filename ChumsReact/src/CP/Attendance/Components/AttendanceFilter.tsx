import React, { ChangeEvent } from 'react';
import { AttendanceFilterInterface, InputBox, ErrorMessages, ApiHelper, CampusInterface } from './';
import { Helper, ServiceInterface, ServiceTimeInterface, GroupInterface } from '../../../Utils';

interface Props {
    filter: AttendanceFilterInterface,
    updatedFunction: (filter: AttendanceFilterInterface) => void
}

export const AttendanceFilter: React.FC<Props> = (props) => {
    const [filter, setFilter] = React.useState(props.filter);
    const [campuses, setCampuses] = React.useState<CampusInterface[]>([]);
    const [services, setServices] = React.useState<ServiceInterface[]>([]);
    const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>([]);
    const [categories, setCategories] = React.useState<string[]>([]);
    const [groups, setGroups] = React.useState<GroupInterface[]>([]);

    const handleUpdate = () => { props.updatedFunction(filter); }

    const loadCampuses = () => ApiHelper.apiGet('/campuses').then(data => { setCampuses(data) });
    const loadServices = () => {
        var url = '/services/search?campusId=' + filter.campusId;
        ApiHelper.apiGet(url).then(data => setServices(data));
    }
    const loadServiceTimes = () => {
        var url = '/servicetimes/search?campusId=' + filter.campusId + '&serviceId=' + filter.serviceId;
        ApiHelper.apiGet(url).then(data => setServiceTimes(data));
    }
    const loadGroups = () => {
        var url = '/groups/search?campusId=' + filter.campusId + '&serviceId=' + filter.serviceId + '&serviceTimeId=' + filter.serviceTimeId;
        ApiHelper.apiGet(url).then(data => {
            var cats: string[] = [];
            var groups: GroupInterface[] = [];
            for (let i = 0; i < data.length; i++) {
                var g = data[i] as GroupInterface;
                if (cats.indexOf(g.categoryName) == -1) cats.push(g.categoryName);
                if (filter.categoryName === '' || filter.categoryName === g.categoryName) groups.push(g);
            }
            setCategories(cats);
            setGroups(groups);
        });
    }



    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        var f = { ...filter };
        switch (e.target.name) {
            case 'week':
                f.startDate = new Date(e.target.value);
                f.endDate = new Date(e.target.value)
                f.endDate.setDate(f.endDate.getDate() + 7);
                break;
            case 'campus': f.campusId = parseInt(e.target.value); break;
            case 'service': f.serviceId = parseInt(e.target.value); break;
            case 'serviceTime': f.serviceTimeId = parseInt(e.target.value); break;
            case 'category': f.categoryName = e.target.value; break;
            case 'group': f.groupId = parseInt(e.target.value); break;
        }
        setFilter(f);
    }

    const getCampusOptions = () => {
        var result = [<option value="0">All</option>];
        for (let i = 0; i < campuses.length; i++) result.push(<option value={campuses[i].id}>{campuses[i].name}</option>);
        return result;
    }

    const getServiceOptions = () => {
        var result = [<option value="0">All</option>];
        for (let i = 0; i < services.length; i++) result.push(<option value={services[i].id}>{services[i].name}</option>);
        return result;
    }

    const getServiceTimeOptions = () => {
        var result = [<option value="0">All</option>];
        for (let i = 0; i < serviceTimes.length; i++) result.push(<option value={serviceTimes[i].id}>{serviceTimes[i].name}</option>);
        return result;
    }

    const getCategoryOptions = () => {
        var result = [<option value="">All</option>];
        for (let i = 0; i < categories.length; i++) result.push(<option value={categories[i]}>{categories[i]}</option>);
        return result;
    }

    const getGroupOptions = () => {
        var result = [<option value="">All</option>];
        for (let i = 0; i < groups.length; i++) result.push(<option value={groups[i].id}>{groups[i].name}</option>);
        return result;
    }

    const loadData = () => {
        loadCampuses();
        loadServices();
        loadServiceTimes();
        loadGroups();
    }

    React.useEffect(() => { loadData(); }, []);
    React.useEffect(() => { loadServices(); }, [filter.campusId]);
    React.useEffect(() => { loadGroups(); }, [filter.serviceTimeId, filter.categoryName]);

    return (
        <InputBox saveFunction={handleUpdate} headerText="Attendance Filter" headerIcon="fas fa-filter" saveText="Filter" >
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label>Week</label>
                        <input type="date" className="form-control form-control-sm" name="week" value={Helper.formatHtml5Date(filter.startDate)} onChange={handleChange} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>Campus</label>
                        <select name="campus" className="form-control form-control-sm" value={filter.campusId} onChange={handleChange}>{getCampusOptions()}</select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label>Service</label>
                        <select name="service" className="form-control form-control-sm" value={filter.serviceId} onChange={handleChange} >{getServiceOptions()}</select>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>Time</label>
                        <select name="serviceTime" className="form-control form-control-sm" value={filter.serviceTimeId} onChange={handleChange} >{getServiceTimeOptions()}</select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" className="form-control form-control-sm" value={filter.categoryName} onChange={handleChange} >{getCategoryOptions()}</select>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label>Group</label>
                        <select name="group" className="form-control form-control-sm" value={filter.groupId} onChange={handleChange} >{getGroupOptions()}</select>
                    </div>
                </div>
            </div>
        </InputBox>
    );
}