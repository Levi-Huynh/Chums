import React, { ChangeEvent } from 'react';
import { AttendanceFilterInterface, InputBox, ApiHelper, CampusInterface, Helper, ServiceInterface, ServiceTimeInterface, GroupInterface } from './';
import { Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

interface Props { filter: AttendanceFilterInterface, updatedFunction: (filter: AttendanceFilterInterface) => void }

export const AttendanceFilter: React.FC<Props> = (props) => {
    const [filter, setFilter] = React.useState(props.filter);
    const [campuses, setCampuses] = React.useState<CampusInterface[]>([]);
    const [services, setServices] = React.useState<ServiceInterface[]>([]);
    const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>([]);
    const [categories, setCategories] = React.useState<string[]>([]);
    const [groups, setGroups] = React.useState<GroupInterface[]>([]);

    const handleUpdate = () => { props.updatedFunction(filter); }
    const loadCampuses = () => ApiHelper.apiGet('/campuses').then(data => { setCampuses(data) });
    const loadServices = () => { ApiHelper.apiGet('/services/search?campusId=' + filter.campusId).then(data => setServices(data)); }
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
                if (cats.indexOf(g.categoryName) === -1) cats.push(g.categoryName);
                if (filter.categoryName === '' || filter.categoryName === g.categoryName) groups.push(g);
            }
            setCategories(cats);
            setGroups(groups);
        });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        var f = { ...filter };
        switch (e.currentTarget.name) {
            case 'week':
                f.startDate = new Date(e.currentTarget.value);
                f.endDate = new Date(e.currentTarget.value)
                f.endDate.setDate(f.endDate.getDate() + 7);
                break;
            case 'campus': f.campusId = parseInt(e.currentTarget.value); break;
            case 'service': f.serviceId = parseInt(e.currentTarget.value); break;
            case 'serviceTime': f.serviceTimeId = parseInt(e.currentTarget.value); break;
            case 'category': f.categoryName = e.currentTarget.value; break;
            case 'group': f.groupId = parseInt(e.currentTarget.value); break;
        }
        setFilter(f);
    }

    const getCampusOptions = () => {
        var result = [<option key={0} value="0">All</option>];
        for (let i = 0; i < campuses.length; i++) result.push(<option key={campuses[i].id} value={campuses[i].id}>{campuses[i].name}</option>);
        return result;
    }

    const getServiceOptions = () => {
        var result = [<option key={0} value="0">All</option>];
        for (let i = 0; i < services.length; i++) result.push(<option key={services[i].id} value={services[i].id}>{services[i].name}</option>);
        return result;
    }

    const getServiceTimeOptions = () => {
        var result = [<option key={0} value="0">All</option>];
        for (let i = 0; i < serviceTimes.length; i++) result.push(<option key={serviceTimes[i].id} value={serviceTimes[i].id}>{serviceTimes[i].name}</option>);
        return result;
    }

    const getCategoryOptions = () => {
        var result = [<option key="" value="">All</option>];
        for (let i = 0; i < categories.length; i++) result.push(<option key={categories[i]} value={categories[i]}>{categories[i]}</option>);
        return result;
    }

    const getGroupOptions = () => {
        var result = [<option key={0} value="">All</option>];
        for (let i = 0; i < groups.length; i++) result.push(<option key={groups[i].id} value={groups[i].id}>{groups[i].name}</option>);
        return result;
    }

    const loadData = () => {
        loadCampuses();
        loadServices();
        loadServiceTimes();
        loadGroups();
    }

    React.useEffect(loadData, []);
    React.useEffect(loadServices, [filter.campusId]);
    React.useEffect(loadGroups, [filter.serviceTimeId, filter.categoryName]);

    return (
        <InputBox saveFunction={handleUpdate} headerText="Attendance Filter" headerIcon="fas fa-filter" saveText="Filter" >
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Week</FormLabel>
                        <FormControl size="sm" type="date" name="week" value={Helper.formatHtml5Date(filter.startDate)} onChange={handleChange} />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <FormLabel>Campus</FormLabel>
                        <FormControl as="select" name="campus" data-testid="campus" value={filter.campusId} onChange={handleChange}>{getCampusOptions()}</FormControl>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Service</FormLabel>
                        <FormControl as="select" name="service" value={filter.serviceId} onChange={handleChange} >{getServiceOptions()}</FormControl>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <FormLabel>Time</FormLabel>
                        <FormControl as="select" name="serviceTime" value={filter.serviceTimeId} onChange={handleChange} >{getServiceTimeOptions()}</FormControl>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>Category</FormLabel>
                        <FormControl as="select" name="category" value={filter.categoryName} onChange={handleChange} >{getCategoryOptions()}</FormControl>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <FormLabel>Group</FormLabel>
                        <FormControl as="select" name="group" value={filter.groupId} onChange={handleChange} >{getGroupOptions()}</FormControl>
                    </FormGroup>
                </Col>
            </Row>
        </InputBox>
    );
}