import React from 'react';
import { ApiHelper, GroupInterface, GroupServiceTimeInterface, ServiceTimeInterface } from './';
import { Table, InputGroup, Button, FormControl } from 'react-bootstrap';

interface Props {
    group: GroupInterface,
    updatedFunction?: (group: GroupInterface) => void
}

export const ServiceTimesEdit: React.FC<Props> = (props) => {

    const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);
    const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>([]);
    const [addServiceTimeId, setAddServiceTimeId] = React.useState(0);

    const loadData = () => {
        ApiHelper.apiGet('/groupservicetimes?groupId=' + props.group.id).then(data => setGroupServiceTimes(data));
        ApiHelper.apiGet('/servicetimes').then(data => {
            setServiceTimes(data);
            var st = data[0] as ServiceTimeInterface;
            if (data.length > 0) setAddServiceTimeId(st.id);
        });
    }

    const getRows = () => {
        var result: JSX.Element[] = [];
        for (let i = 0; i < groupServiceTimes.length; i++) {
            var gst = groupServiceTimes[i];
            result.push(<tr key={gst.id}><td><i className="far fa-clock"></i> {gst.serviceTime.name}</td><td><a href="about:blank" className="text-danger" data-id={gst.id} onClick={handleRemove}><i className="fas fa-user-times"></i> Remove</a></td></tr>);
        }
        return result;
    }

    const getOptions = () => {
        var result: JSX.Element[] = [];
        for (let i = 0; i < serviceTimes.length; i++) result.push(<option value={serviceTimes[i].id} >{serviceTimes[i].longName}</option>);
        return result;
    }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var gst = { groupId: props.group.id, serviceTimeId: addServiceTimeId } as GroupServiceTimeInterface;
        ApiHelper.apiPost('/groupservicetimes', [gst]).then(loadData);
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var id = parseInt(anchor.getAttribute('data-id'));
        ApiHelper.apiDelete('/groupservicetimes/' + id.toString()).then(loadData);
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAddServiceTimeId(parseInt(e.currentTarget.value));

    React.useEffect(() => { if (props.group.id !== undefined) loadData() }, [props.group]);

    return (
        <div>
            <label>Service Times (optional)</label>
            <Table><tbody>{getRows()}</tbody></Table>
            <InputGroup>
                <FormControl as="select" value={addServiceTimeId} onChange={handleChange} >{getOptions()}</FormControl>
                <InputGroup.Append>
                    <Button variant="primary" onClick={handleAdd}><i className="fas fa-plus"></i> Add</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>

    );
}

