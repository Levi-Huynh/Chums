import React from 'react';
import { ApiHelper, DisplayBox, FormInterface, FormEdit } from './Components'
import { Link } from 'react-router-dom'

export const FormsPage = () => {
    const [forms, setForms] = React.useState<FormInterface[]>([]);
    const [selectedFormId, setSelectedFormId] = React.useState(-1);

    const loadData = () => { ApiHelper.apiGet('/forms').then(data => setForms(data)); }

    const getRows = () => {
        var result = [];
        for (let i = 0; i < forms.length; i++) {
            result.push(<tr>
                <td><i className="fas fa-align-left" /> <Link to={"/cp/forms/" + forms[i].id}>{forms[i].name}</Link></td>
                <td><a href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedFormId(forms[i].id); }}><i className="fas fa-pencil-alt"></i></a></td>
            </tr>);
        }
        return result;
    }

    const handleUpdate = () => {
        loadData();
        setSelectedFormId(-1);
    }

    const getSidebar = () => {
        if (selectedFormId === -1) return <></>
        else return (<FormEdit formId={selectedFormId} updatedFunction={handleUpdate} ></FormEdit>)
    }

    const getEditContent = () => { return (<a href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedFormId(0); }} ><i className="fas fa-plus"></i></a>); }

    React.useEffect(loadData, []);

    return (
        <>
            <h1><i className="fas fa-align-left"></i> Forms</h1>
            <div className="row">
                <div className="col-lg-8">
                    <DisplayBox headerText="Forms" headerIcon="fas fa-align-left" editContent={getEditContent()} >
                        <table className="table">
                            <tr><th colSpan={2}>Name</th></tr>
                            {getRows()}
                        </table>
                    </DisplayBox>
                </div>
                <div className="col-lg-4">
                    {getSidebar()}
                </div>
            </div>
        </>
    );
}

