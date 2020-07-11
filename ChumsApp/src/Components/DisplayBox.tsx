import React from 'react';
import { Row, Col } from 'react-bootstrap';

interface Props {
    id?: string,
    children: React.ReactNode,
    headerIcon: string,
    headerText: string,
    editFunction?: () => void
    editContent?: React.ReactNode;
}

export const DisplayBox: React.FC<Props> = (props) => {
    var editContent = <></>;
    if (props.editFunction !== undefined) editContent = <a onClick={e => { e.preventDefault(); props.editFunction(); }} href="about:blank" ><i className="fas fa-pencil-alt"></i></a>;
    else if (props.editContent !== undefined) editContent = <div>{props.editContent}</div>;
    return (
        <div className="inputBox" id={props.id}>
            <div className="header">
                <Row>
                    <Col xs={8}><i className={props.headerIcon}></i> {props.headerText}</Col>
                    <Col xs={4} style={{ textAlign: 'right' }} >{editContent}</Col>
                </Row>
            </div>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
}


