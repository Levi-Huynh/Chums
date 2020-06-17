import React from 'react';
import { ApiHelper, GroupInterface, GroupServiceTimeInterface } from './';

interface Props { group: GroupInterface }

export const ServiceTimes: React.FC<Props> = (props) => {

    const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);

    const loadData = () => ApiHelper.apiGet('/groupservicetimes?groupId=' + props.group.id).then(data => setGroupServiceTimes(data));

    const getRows = () => {
        var result: JSX.Element[] = [];
        for (let i = 0; i < groupServiceTimes.length; i++) {
            var gst = groupServiceTimes[i];
            result.push(<div key={gst.id}> {gst.serviceTime.name}</div>);
        }
        return result;
    }

    React.useEffect(() => { if (props.group.id !== undefined) loadData() }, [props.group]);

    return (
        <table>
            <tbody>
                <tr>
                    <td><label>Service(s):</label></td>
                    <td>{getRows()}</td>
                </tr>
            </tbody>
        </table>

    );
}

