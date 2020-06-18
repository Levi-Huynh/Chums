import React from 'react';

interface Props {
    children: React.ReactNode,
    headerIcon: string,
    headerText: string,
    editFunction?: () => void
    editContent?: JSX.Element;
}

export const DisplayBox: React.FC<Props> = (props) => {
    var editContent = <></>;
    if (props.editFunction !== undefined) editContent = <a onClick={e => { e.preventDefault(); props.editFunction(); }} href="#" ><i className="fas fa-pencil-alt"></i></a>;
    else if (props.editContent !== undefined) editContent = <div>{props.editContent}</div>;
    return (
        <div className="inputBox">
            <div className="header">
                <div className="row">
                    <div className="col-8"><i className={props.headerIcon}></i> {props.headerText}</div>
                    <div className="col-4" style={{ textAlign: 'right' }} >{editContent}</div>
                </div>
            </div>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}


