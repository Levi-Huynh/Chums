import { format as dateFormat } from 'date-fns'

export class Helper {

    static loadExternalScript(url: string, callback: () => void) {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = callback;
        document.body.appendChild(script);
    }

    static formatDate(date: Date, format: string) {
        try {
            var cleanDate = new Date(new Date(date).toISOString().split('T')[0]); //truncate the time
            return dateFormat(cleanDate, format);
        } catch { return ''; }
    }

    static prettyDate(date: Date) {
        if (date === undefined || date === null) return '';
        return this.formatDate(date, 'MMM d, yyyy');
    }

    static formatCurrency(amount: number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        return formatter.format(amount);
    }

    static getLastSunday() {
        var result = new Date();
        while (result.getDay() !== 0) result.setDate(result.getDate() - 1);
        return result;
    }

    static getWeekSunday(year: number, week: number) {
        var result = new Date(year, 0, 1);
        while (result.getDay() !== 0) result.setDate(result.getDate() + 1);
        result.setDate(result.getDate() + ((week - 1) * 7));
        return result;
    }

    static formatHtml5Date(date: Date): string {
        if (date === undefined || date === null) return '';
        else return new Date(date).toISOString().split('T')[0];
    }

    static getDisplayDuration(d: Date): string {
        var seconds = Math.round((new Date().getTime() - d.getTime()) / 1000);
        if (seconds > 86400) {
            var days = Math.floor(seconds / 86400);
            return (days === 1) ? "1 day" : days.toString() + " days";
        }
        else if (seconds > 3600) {
            var hours = Math.floor(seconds / 3600);
            return (hours === 1) ? "1 hour" : hours.toString() + " hours";
        }
        else if (seconds > 60) {
            var minutes = Math.floor(seconds / 60);
            return (minutes === 1) ? "1 minute" : minutes.toString() + " minutes";
        }
        else return (seconds === 1) ? "1 second" : Math.floor(seconds).toString() + " seconds";
    }

    static getShortDate(d: Date): string {
        return (d.getMonth() + 1).toString() + '/' + (d.getDate() + 1).toString() + '/' + d.getFullYear().toString();
    }

}