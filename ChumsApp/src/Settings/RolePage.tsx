import React from 'react';
import { ApiHelper, DisplayBox, RoleInterface, PersonAdd, PersonInterface, RoleMemberInterface, UserHelper } from './Components';
import { RouteComponentProps } from 'react-router-dom'
import { RoleMembers } from './Components/RoleMembers';
import { RolePermissions } from './Components/RolePermissions';

type TParams = { id?: string };
export const RolePage = ({ match }: RouteComponentProps<TParams>) => {
    const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);

    const loadData = () => { ApiHelper.apiGet('/roles/' + match.params.id).then(data => setRole(data)); }
    const addPerson = (p: PersonInterface) => {
        var rm: RoleMemberInterface = { roleId: role.id, personId: p.id };
        ApiHelper.apiPost('/rolemembers', [rm]).then(loadData);
    }
    const getSidebar = () => {
        if (!UserHelper.checkAccess('Roles', 'Edit')) return (null);
        else return (<>
            <DisplayBox headerIcon="fas fa-user" headerText="Add Person"><PersonAdd addFunction={addPerson} /></DisplayBox>
            <RolePermissions role={role} />
        </>);
    }

    React.useEffect(loadData, []);

    if (!UserHelper.checkAccess('Roles', 'View')) return (<></>);
    else {
        return (
            <>
                <h1><i className="fas fa-lock"></i> {role.name}</h1>
                <div className="row">
                    <div className="col-lg-8">
                        <RoleMembers role={role} />
                    </div>
                    <div className="col-lg-4">
                        {getSidebar()}
                    </div>
                </div>
            </>
        );
    }
}

