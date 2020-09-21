import React from 'react';
import { ApiHelper, DisplayBox, RoleInterface, PersonAdd, PersonInterface, RoleMemberInterface, UserHelper } from './Components';
import { RouteComponentProps } from 'react-router-dom'
import { RoleMembers } from './Components/RoleMembers';
import { RolePermissions } from './Components/RolePermissions';
import { Row, Col } from 'react-bootstrap';

type TParams = { id?: string };
export const RolePage = ({ match }: RouteComponentProps<TParams>) => {
    const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);

    const loadData = () => { ApiHelper.accessGet('/roles/' + match.params.id).then(data => setRole(data)); }

    const addPerson = (p: PersonInterface) => {
        const email = p.contactInfo?.email;
        if (email === undefined || email === null || email === "") alert("You must first enter an email address for this person.");
        else {
            var rm: RoleMemberInterface = {
                roleId: role.id,
                userId: p.userId,
                user: { name: p.name.display, email: p.contactInfo.email }
            };
        }
        ApiHelper.accessPost('/rolemembers', [rm]).then(async (data: RoleMemberInterface[]) => {
            if (p.userId === undefined || p.userId === null || p.userId === 0) {
                p.userId = data[0].userId;
                await ApiHelper.apiPost("/people", [p]);
            }
            loadData();
        });
    }

    const getSidebar = () => {
        if (!UserHelper.checkAccess('Roles', 'Edit')) return (null);
        else return (<>
            <DisplayBox id="roleMemberAddBox" headerIcon="fas fa-user" headerText="Add Person"><PersonAdd addFunction={addPerson} /></DisplayBox>
            <RolePermissions role={role} />
        </>);
    }

    React.useEffect(loadData, []);

    if (!UserHelper.checkAccess('Roles', 'View')) return (<></>);
    else {
        return (
            <>
                <h1><i className="fas fa-lock"></i> {role.name}</h1>
                <Row>
                    <Col lg={8}><RoleMembers role={role} /></Col>
                    <Col lg={4}>{getSidebar()}</Col>
                </Row>
            </>
        );
    }
}

