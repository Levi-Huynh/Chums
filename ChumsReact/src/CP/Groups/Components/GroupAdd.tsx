import React from 'react';
import { ApiHelper, GroupInterface, DisplayBox, UserHelper, GroupMemberInterface, PersonHelper } from './';
import { Link } from 'react-router-dom';
import { PersonInterface } from '../../../Utils';
import { InputBox } from '../../Components';

interface Props {
    updatedFunction: () => void
}

export const GroupAdd: React.FC<Props> = (props) => {

    const [categoryName, setCategoryName] = React.useState('');
    const [groupName, setGroupName] = React.useState('');
    const handleCancel = () => { props.updatedFunction(); };
    const handleAdd = () => {
        var group = { categoryName: categoryName, name: groupName } as GroupInterface
        ApiHelper.apiPost('/groups', [group]).then(() => props.updatedFunction());
    };

    return (
        <InputBox headerText="Group Members" headerIcon="fas fa-users" cancelFunction={handleCancel} saveFunction={handleAdd} saveText="Add Group" >
            <div className="form-group">
                <label>Category Name</label>
                <input type="text" className="form-control" value={categoryName} onChange={(e) => { setCategoryName(e.currentTarget.value) }} />
            </div>
            <div className="form-group">
                <label>Group Name</label>
                <input type="text" className="form-control" value={groupName} onChange={(e) => { setGroupName(e.currentTarget.value) }} />
            </div>
        </InputBox>
    );
}

