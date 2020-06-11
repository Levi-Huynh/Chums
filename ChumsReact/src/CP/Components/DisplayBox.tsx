import React from 'react';

interface Props {
    children: JSX.Element
    headerIcon: string,
    headerText: string,
    editFunction?: () => void
}

export const DisplayBox: React.FC<Props> = (props) => {
    var editLink = <></>;
    if (props.editFunction !== undefined) editLink = <a className="fa-pull-right" onClick={props.editFunction} href="#" ><i className="fas fa-pencil-alt"></i></a>;
    return (
        <div className="inputBox">
            <div className="header">{editLink}<i className={props.headerIcon}></i> {props.headerText}</div>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}


