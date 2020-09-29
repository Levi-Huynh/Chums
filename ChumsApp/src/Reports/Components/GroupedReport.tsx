import React from 'react';
import { ApiHelper, DisplayBox, ReportInterface } from '.';
import { Link } from 'react-router-dom';
import { ReportColumnInterface } from '../../Utils';

interface Props { report?: ReportInterface }

export const GroupedReport = (props: Props) => {

    const getTableHeader = () => {
        if (props.report === undefined || props.report === null || props.report.groupLevels === undefined) return null;
        const cells: JSX.Element[] = [];
        for (let j = props.report.groupLevels; j < props.report.columns.length; j++) {
            const val = props.report.columns[j].heading
            cells.push(<th>{val}</th>);
        }
        return (<tr>{cells}</tr>);
    }

    const getRows = () => {
        if (props.report === undefined || props.report === null || props.report.groupLevels === undefined) return null;
        else {
            const prevValues: any[] = [];
            const result: JSX.Element[] = [];
            props.report.results.forEach(r => { addRow(result, r, props.report.groupLevels, props.report.columns, prevValues); });
            return result;
        }
    }

    const addRow = (result: JSX.Element[], row: any, groupLevels: number, columns: ReportColumnInterface[], prevValues: any[]) => {
        //Add groupings
        for (let j = 0; j < groupLevels; j++) {
            const col = columns[j];
            const groupVal = row[col.field];
            console.log(groupVal);
            if (prevValues.length <= j || prevValues[j] !== groupVal) {
                prevValues[j] = groupVal;
                result.push(<tr><td className={"heading" + (j + 1).toString()} colSpan={columns.length - groupLevels}>{groupVal}</td></tr>);
            }
        }

        //Add row
        const cells: JSX.Element[] = [];
        for (let j = groupLevels; j < columns.length; j++) {
            const val = row[columns[j].field];
            if (j === groupLevels) cells.push(<td className={"indent" + (props.report.groupLevels + 1)}>{val}</td>);
            else cells.push(<td>{val}</td>);
        }
        result.push(<tr>{cells}</tr>);
        return result;

    }


    return (
        <DisplayBox headerIcon="far fa-chart-bar" headerText="Reports" >
            <table className="table report table-sm">
                <thead className="thead-dark">
                    {getTableHeader()}
                </thead>
                <tbody>
                    {getRows()}
                </tbody>
            </table>
        </DisplayBox>
    );
}
