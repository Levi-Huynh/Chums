import React from 'react';
import { ApiHelper, GroupInterface, DisplayBox, SessionInterface, VisitSessionInterface, PersonInterface, PersonHelper, VisitInterface, UserHelper, ExportLink } from './';

interface Props {
    group: GroupInterface,
    sidebarVisibilityFunction: (name: string, visible: boolean) => void,
    addedSession: SessionInterface,
    addedPerson: PersonInterface,
    addedCallback?: () => void
}

export const GroupSessions: React.FC<Props> = (props) => {
    const [visitSessions, setVisitSessions] = React.useState<VisitSessionInterface[]>([]);
    const [sessions, setSessions] = React.useState<SessionInterface[]>([]);
    const [session, setSession] = React.useState<SessionInterface>(null);

    const loadAttendance = () => ApiHelper.apiGet('/visitsessions?sessionId=' + session.id).then(data => setVisitSessions(data));
    const loadSessions = () => ApiHelper.apiGet('/sessions?groupId=' + props.group.id).then(data => {
        setSessions(data);
        if (data.length > 0) setSession(data[0]);
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var personId = parseInt(anchor.getAttribute('data-personid'));
        ApiHelper.apiDelete('/visitsessions?sessionId=' + session.id + '&personId=' + personId).then(loadAttendance);
    }
    const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); props.sidebarVisibilityFunction('addSession', true); }

    const getRows = () => {
        var canEdit = UserHelper.checkAccess('Attendance', 'Edit');
        var result: JSX.Element[] = [];
        for (let i = 0; i < visitSessions.length; i++) {
            var vs = visitSessions[i];
            var editLink = (canEdit) ? (<a href="about:blank" onClick={handleRemove} className="text-danger" data-personid={vs.visit.personId} ><i className="fas fa-user-times"></i> Remove</a>) : null;
            result.push(
                <tr>
                    <td><img className="personPhoto" src={PersonHelper.getPhotoUrl(vs.visit.person)} alt="avatar" /></td>
                    <td><a className="personName" href={"/people/person.aspx?id=" + vs.visit.personId}>{vs.visit.person.displayName}</a></td>
                    <td>{editLink}</td>
                </tr >
            );
        }
        return result;
    }


    const selectSession = (e: React.ChangeEvent<HTMLSelectElement>) => {
        for (let i = 0; i < sessions.length; i++) if (sessions[i].id === parseInt(e.currentTarget.value)) setSession(sessions[i]);
    }

    const getSessionOptions = () => {
        var result: JSX.Element[] = [];
        for (let i = 0; i < sessions.length; i++) result.push(<option value={sessions[i].id}>{sessions[i].displayName}</option>);
        return result;
    }

    const getHeaderSection = () => {
        if (!UserHelper.checkAccess('Attendance', 'Edit')) return null;
        else return (
            <div className="input-group">
                <select className="form-control" value={session?.id} onChange={selectSession} >{getSessionOptions()}</select>
                <div className="input-group-append">
                    <a href="about:blank" className="btn btn-primary" onClick={handleAdd} ><i className="far fa-calendar-alt"></i> New</a>
                </div>
            </div>
        );
    }

    const handleSessionSelected = () => {
        if (session !== null) {
            loadAttendance();
            props.sidebarVisibilityFunction('addPerson', true);
        }
    }

    const handlePersonAdd = () => {
        var v = { checkinTime: new Date(), personId: props.addedPerson.id, visitSessions: [{ sessionId: session.id }] } as VisitInterface;

        ApiHelper.apiPost('/visitsessions/log', v).then(() => {
            loadAttendance();
        });
        props.addedCallback();
    }

    React.useEffect(() => { if (props.group.id !== undefined) loadSessions(); props.addedCallback(); }, [props.group, props.addedSession]);
    React.useEffect(() => { if (props.addedPerson?.id !== undefined) handlePersonAdd() }, [props.addedPerson]);
    React.useEffect(handleSessionSelected, [session]);

    var content = <></>;
    if (sessions.length === 0) content = <div className="alert alert-warning" role="alert"><b>There are no sessions.</b>  Please add a new session to continue.</div>
    else content = (<>
        <span className="float-right"><ExportLink data={visitSessions} spaceAfter={true} /></span>
        <b>Attendance for {props.group.name}</b>
        <table className="table" id="groupMemberTable">
            <tr><th></th><th>Name</th><th></th></tr>
            {getRows()}
        </table>
    </>);

    return (<DisplayBox headerText="Sessions" headerIcon="far fa-calendar-alt" editContent={getHeaderSection()} >{content}</DisplayBox>);
}

