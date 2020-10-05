import React from 'react';
import { DisplayBox, ReportInterface } from '.';
import { ReportColumnInterface } from '../../Utils';

interface Props { report?: ReportInterface }

export const GroupedReport = (props: Props) => {

    const getTableHeader = () => {
        if (props.report === undefined || props.report === null || props.report.columns === undefined) return null;
        const groupLevels = getGroupLevels();
        const cells: JSX.Element[] = [];
        for (let j = groupLevels; j < props.report.columns.length; j++) {
            const val = props.report.columns[j].heading
            cells.push(<th>{val}</th>);
        }
        return (<tr>{cells}</tr>);
    }

    const getRows = () => {
        if (props.report?.results === undefined) return null;
        else {
            const groupLevels = getGroupLevels();
            const prevValues: any[] = [];
            const result: JSX.Element[] = [];
            props.report.results.forEach(r => { addRow(result, r, groupLevels, props.report.columns, prevValues); });
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
            if (j === groupLevels) cells.push(<td className={"indent" + (groupLevels + 1)}>{val}</td>);
            else cells.push(<td>{val}</td>);
        }
        result.push(<tr>{cells}</tr>);
        return result;

    }

    const getGroupLevels = () => {
        var result = 0;
        if (props.report.columns !== undefined) {
            for (let i = 0; i < props.report.columns.length; i++) {
                if (props.report.columns[i].grouped) result = i + 1;
            }
        }
        return result;
    }


    return (
        <table className="table report table-sm">
            <thead className="thead-dark">
                {getTableHeader()}
            </thead>
            <tbody>
                {getRows()}
            </tbody>
        </table>
    );
}
