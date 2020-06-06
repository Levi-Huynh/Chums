import React, { Fragment } from 'react';

class InputBox extends React.Component {
    render() {
        return (
            <form method="post">
                <div className="inputBox">
                    <div className="header"><i className={this.props.headerIcon}></i> {this.props.headerText}</div>
                    <div className="content">
                        {this.props.children}
                    </div>
                    <div className="footer">
                        <div className="row">
                            <div className="col"><input type="submit" value="Cancel" className="btn btn-warning btn-block" onClick={this.props.cancelFunction} /></div>
                            <div className="col"><input type="submit" value="Delete" className="btn btn-danger btn-block" onClick={this.props.deleteFunction} /></div>
                            <div className="col"><input type="submit" value="Save" className="btn btn-success btn-block" onClick={this.props.saveFunction} /></div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default InputBox;

