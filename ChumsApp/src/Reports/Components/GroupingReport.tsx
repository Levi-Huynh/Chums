import React from 'react';
import { ApiHelper, DisplayBox, ReportInterface } from './';
import { Link } from 'react-router-dom';

interface Props { report?: ReportInterface }

export const GroupingReport = (props: Props) => {


    const getRows = () => {
        console.log(props);
        if (props.report === undefined || props.report === null || props.report.groupBy === undefined) return null;
        else {
            const prevValues: any[] = [];
            const groupings = props.report.groupBy.split(',');
            const result: JSX.Element[] = [];
            props.report.results.forEach(r => {
                for (let j = 0; j < groupings.length; j++) {
                    const groupVal = r[groupings[j]];
                    if (prevValues.length <= j || prevValues[j] !== groupVal) {
                        prevValues[j] = groupVal;
                        result.push(<div className={"heading" + (j + 1).toString()}>{groupVal}</div>)
                    }
                }
                result.push(<div className={"indent" + (groupings.length + 1)}>{r.personName}</div>);
            });
            return result;
        }
    }


    return (
        <DisplayBox headerIcon="far fa-chart-bar" headerText="Reports" >
            <div className="report">
                {getRows()}
            </div>
        </DisplayBox>
    );
}
