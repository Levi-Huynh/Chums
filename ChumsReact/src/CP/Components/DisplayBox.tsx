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
    if (props.editFunction !== undefined) editContent = <a className="fa-pull-right" onClick={e => { e.preventDefault(); props.editFunction(); }} href="#" ><i className="fas fa-pencil-alt"></i></a>;
    else if (props.editContent !== undefined) editContent = <div className="fa-pull-right">{props.editContent}</div>;
    return (
        <div className="inputBox">
            <div className="header">{editContent}<i className={props.headerIcon}></i> {props.headerText}</div>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}


