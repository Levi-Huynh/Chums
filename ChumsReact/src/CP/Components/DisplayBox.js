import React from 'react';

class DisplayBox extends React.Component {
    render() {

        var editLink = '';
        if (this.props.editFunction !== undefined) editLink = <a className="fa-pull-right" onClick={this.props.editFunction} href="#" ><i className="fas fa-pencil-alt"></i></a>;

        return (
            <div className="inputBox">
                <div className="header">{editLink}<i className={this.props.headerIcon}></i> {this.props.headerText}</div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default DisplayBox;

