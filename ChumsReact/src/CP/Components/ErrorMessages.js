import React, { Fragment } from 'react';

function ErrorMessages(props) {
    const items = [];
    var result=<Fragment />
    if (props.errors!=null && props.errors.length>0) 
    {
        for (var i=0;i<props.errors.length;i++) items.push(<li>{props.errors[i]}</li>);
        result = <div class="alert alert-warning" role="alert"><ul>{items}</ul></div>;
    }
    return result;
}

export default ErrorMessages;

