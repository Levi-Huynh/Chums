import React from 'react';
import { ApiHelper, GroupInterface, DisplayBox, RoleInterface, RolePermissionInterface, RoleCheck } from './';
import { Link } from 'react-router-dom';



interface Props {
    role: RoleInterface
}

export const RolePermissions: React.FC<Props> = (props) => {

    const [rolePermissions, setRolePermissions] = React.useState<RolePermissionInterface[]>([]);

    const loadData = () => ApiHelper.apiGet('/rolepermissions?roleId=' + props.role.id).then(data => setRolePermissions(data));

    React.useEffect(() => { if (props.role.id !== undefined) loadData() }, [props.role]);

    return (
        <DisplayBox headerText="Edit Permissions" headerIcon="fas fa-lock" >
            <div className="row">
                <div className="col-xl-6">
                    <div><b>People:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="People" action="Edit" label="Edit" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Households" action="Edit" label="Edit Households" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="People" action="View Notes" label="View Notes" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="People" action="Edit Notes" label="Edit Notes" />
                </div>
                <div className="col-xl-6">
                    <div><b>Groups:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Groups" action="View" label="View" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Groups" action="Edit" label="Edit" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Group Members" action="View" label="View Members" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Group Members" action="Edit" label="Edit Members" />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-xl-6">
                    <div><b>Attendance:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Attendance" action="View Summary" label="View Summary" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Attendance" action="View" label="View Individual" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Attendance" action="Edit" label="Edit" />
                </div>
                <div className="col-xl-6">
                    <div><b>Donations:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Donations" action="View Summary" label="View Summary" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Donations" action="View" label="View Individual" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Donations" action="Edit" label="Edit" />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-xl-6">
                    <div><b>Forms:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Forms" action="View" label="View" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Forms" action="Edit" label="Edit" />
                </div>
                <div className="col-xl-6">
                    <div><b>Roles:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Roles" action="View" label="View" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Roles" action="Edit" label="Edit" />
                </div>
            </div>
            <div className="row">
                <div className="col-xl-6">
                    <div><b>Services:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Services" action="Edit" label="Edit" />
                </div>
            </div>
        </DisplayBox>
    );
}

