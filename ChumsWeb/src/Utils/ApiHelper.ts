export interface ChurchInterface { id?: number }
export interface PermissionInterface { contentType?: string, action?: string }
export interface RegisterInterface { churchName?: string, firstName?: string, lastName?: string, email?: string, password?: string }
export interface UserMappingInterface { church?: ChurchInterface, personId?: number }
export interface UserInterface { apiKey: string, name: string }

export class ApiHelper {
    //*** What's a good way to toggle this based on environment?
    static baseUrl = 'https://api.chums.org';
    //static baseUrl = 'http://localhost:50494';
    static apiKey = '';

    static async apiGet(path: string) {
        const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.apiKey } };
        return fetch(this.baseUrl + path, requestOptions).then(response => response.json())
    }

    static async apiPost(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.baseUrl + path, requestOptions).then(response => response.json())
    }

    static async apiPostAnonymous(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.baseUrl + path, requestOptions).then(response => response.json())
    }

    static async apiDelete(path: string) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.apiKey }
        };
        return fetch(this.baseUrl + path, requestOptions);
    }

    static async login(email: string, password: string) {
        var data = { Email: email, Password: password };
        const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
        return fetch(this.baseUrl + '/users/login', requestOptions)
            .then(response => response.json());
    }

}

