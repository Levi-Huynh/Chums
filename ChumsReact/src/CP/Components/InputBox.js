import React from 'react';

class InputBox extends React.Component {
    render() {
        var saveText = 'Save';
        if (this.props.saveText !== undefined) saveText = this.props.saveText;

        var buttons = [];
        if (this.props.cancelFunction !== undefined) buttons.push(<div className="col" key="cancel"><input type="submit" value="Cancel" className="btn btn-warning btn-block" onClick={this.props.cancelFunction} /></div>);
        if (this.props.deleteFunction !== undefined) buttons.push(<div className="col" key="delete"><input type="submit" value="Delete" className="btn btn-danger btn-block" onClick={this.props.deleteFunction} /></div>);
        if (this.props.saveFunction !== undefined) buttons.push(<div className="col" key="save"><input type="submit" value={saveText} className="btn btn-success btn-block" onClick={this.props.saveFunction} /></div>);

        return (
            <form method="post">
                <div className="inputBox">
                    <div className="header"><i className={this.props.headerIcon}></i> {this.props.headerText}</div>
                    <div className="content">
                        {this.props.children}
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
}

export default InputBox;

