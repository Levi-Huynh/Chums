export class Helper {
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