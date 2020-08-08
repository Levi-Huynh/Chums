import React from 'react';

interface Props { icon: string, title: string, content: string }

export const HomeFeature: React.FC<Props> = (props) => {
    return (
        <div className="homeFeature">
            <div className="icon"><span className="icon"><i className={props.icon}></i></span></div>
            <div className="feature">{props.title}</div>
            <div>{props.content}</div>
        </div>
    );
}
