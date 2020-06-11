import React from 'react';

interface Props {
    children: any,  //***what's the correct type?
    headerIcon: string,
    headerText: string,
    saveText?: string,
    cancelFunction?: () => void
    deleteFunction?: () => void
    saveFunction: () => void
}
export const InputBox: React.FC<Props> = (props) => {
    var saveText = 'Save';
    if (props.saveText !== undefined) saveText = props.saveText;

    var buttons = [];
    if (props.cancelFunction !== undefined) buttons.push(<div className="col" key="cancel"><input type="submit" value="Cancel" className="btn btn-warning btn-block" onClick={e => { e.preventDefault(); props.cancelFunction() }} /></div>);
    if (props.deleteFunction !== undefined) buttons.push(<div className="col" key="delete"><input type="submit" value="Delete" className="btn btn-danger btn-block" onClick={e => { e.preventDefault(); props.deleteFunction() }} /></div>);
    if (props.saveFunction !== undefined) buttons.push(<div className="col" key="save"><input type="submit" value={saveText} className="btn btn-success btn-block" onClick={e => { e.preventDefault(); props.saveFunction() }} /></div>);

    return (
        <form method="post">
            <div className="inputBox">
                <div className="header"><i className={props.headerIcon}></i> {props.headerText}</div>
                <div className="content">
                    {props.children}
                </div>
                <div className="footer">
                    <div className="row">
                        {buttons}
                    </div>
                </div>
            </div>
        </form>
    );
}

