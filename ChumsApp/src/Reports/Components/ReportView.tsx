import React from 'react';
import { ReportInterface, GroupedReport, BarChart, DisplayBox, ExportLink } from '.';

interface Props { report?: ReportInterface }

export const ReportView = (props: Props) => {

    const handlePrint = (e: React.MouseEvent) => {
        e.preventDefault();
        var content = document.getElementById("chartBox").getElementsByClassName('content')[0].innerHTML;
        var printFrame: any = document.getElementById("printFrame");
        var cw = printFrame.contentWindow;
        //cw.document.open;
        cw.document.write(content);
        //cw.document.close();
        cw.focus();
        cw.print();
    }

    const getEditContent = () => {
        const result: JSX.Element[] = [];
        if (props.report?.results !== undefined) {
            result.push(<a href="about:blank" onClick={handlePrint} title="print"><i className="fas fa-print"></i></a>);
            result.push(<ExportLink data={props.report.results} filename={props.report.title.replace(" ", "_") + ".csv"} />);
        }
        return result;
    }

    const getChart = () => {
        if (props.report === undefined || props.report === null) return null;
        var result = <></>
        switch (props.report.reportType) {
            case "Area Chart":
            case "Bar Chart":
                result = (<BarChart report={props.report} />);
                break;
            default:
                result = (<GroupedReport report={props.report} />);
                break;
        }
        return result;
    }

    return (
        <>
            <DisplayBox id="chartBox" headerIcon="far fa-chart-bar" headerText={props.report.title} editContent={getEditContent()} >
                {getChart()}
            </DisplayBox >
        </>
    );

}
