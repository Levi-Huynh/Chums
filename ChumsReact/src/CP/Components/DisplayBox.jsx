import React from 'react';

const DisplayBox = (props) => {
    var editLink = '';
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

export default DisplayBox;

