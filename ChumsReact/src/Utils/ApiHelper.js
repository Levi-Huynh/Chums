class ApiHelper {
    static baseUrl = 'https://mus2ockmn2.execute-api.us-east-2.amazonaws.com/Stage';
    //static baseUrl = 'http://localhost:50494';
    static apiKey = '';

    static async apiGet(path) {
        const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.apiKey } };
        return fetch(this.baseUrl + path, requestOptions).then(response => response.json())
    }

    static async apiPost(path, data) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.baseUrl + path, requestOptions).then(response => response.json())
    }

    static async apiDelete(path) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.apiKey }
        };
        return fetch(this.baseUrl + path, requestOptions);
    }

}

export default ApiHelper;