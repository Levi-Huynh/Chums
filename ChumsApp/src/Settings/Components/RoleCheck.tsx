import React from 'react';
import { ApiHelper, RolePermissionInterface } from './';

interface Props {
    contentType: string,
    action: string,
    label: string,
    roleId: number,
    rolePermissions: RolePermissionInterface[]
}

export const RoleCheck: React.FC<Props> = (props) => {
    const [rolePermission, setRolePermission] = React.useState<RolePermissionInterface>(null);

    const init = () => {
        for (let i = 0; i < props.rolePermissions.length; i++) {
            var rp = props.rolePermissions[i];
            if (rp.contentType === props.contentType && rp.action === props.action) setRolePermission(rp);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            var rp: RolePermissionInterface = { roleId: props.roleId, contentType: props.contentType, action: props.action }
            ApiHelper.apiPost('/rolepermissions/', [rp]).then(data => {
                rp.id = data[0];
                setRolePermission(rp);
            });

        } else {
            ApiHelper.apiDelete('/rolepermissions/' + rolePermission.id);
            setRolePermission(null);
        }
    }

    React.useEffect(init, [props.rolePermissions]);

    return (
        <div className="form-check">
            <input type="checkbox" className="form-check-input" checked={rolePermission !== null} onChange={handleChange} />
            <label className="form-check-label">{props.label}</label>
        </div>
    );
}

