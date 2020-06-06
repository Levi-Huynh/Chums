class Helper {
    static formatHtml5Date(date) {
        if (date !== undefined && date !== '') {
            return new Date(date).toISOString().split('T')[0]
        }
        else return "";
    }

}

export default Helper;