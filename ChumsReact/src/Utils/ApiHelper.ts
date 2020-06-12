export interface AnswerInterface { id?: number, value?: string }
export interface ChurchInterface { id?: number }
export interface FormInterface { id?: number, name?: string }
export interface FormSubmissionInterface { id?: number, formId?: number, contentType?: string, contentId?: number, form?: FormInterface, answers?: AnswerInterface[], questions?: QuestionInterface[] }
export interface HouseholdInterface { id?: number, name?: string }
export interface HouseholdMemberInterface { id?: number, householdId?: number, household?: HouseholdInterface, personId?: number, person?: PersonInterface, role?: string }
export interface NoteInterface { dateAdded?: string, person?: PersonInterface }
export interface PermissionInterface { contentType?: string, action?: string }
export interface PersonInterface { id?: number, firstName?: string, middleName?: string, lastName?: string, nickName?: string, displayName?: string, membershipStatus?: string, gender?: string, birthDate?: Date, maritalStatus?: string, anniversary?: Date, address1?: string, address2?: string, city?: string, state?: string, zip?: string, homePhone?: string, mobilePhone?: string, workPhone?: string, email?: string, formSubmissions?: [FormSubmissionInterface], photoUpdated?: Date }
export interface QuestionInterface { id?: number, title?: string, fieldType?: string, placeholder?: string, description?: string, choices?: [{ value?: string, text?: string }] }
export interface UserMappingInterface { church?: ChurchInterface, personId?: number }
export interface UserInterface { apiKey: string, name: string }
//*** I can't figure out how to daisy chain export these interfaces




export class ApiHelper {
    static baseUrl = 'https://mus2ockmn2.execute-api.us-east-2.amazonaws.com/Stage';
    //static baseUrl = 'http://localhost:50494';
    static apiKey = '';

    static async apiGet(path: string) {
        const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.apiKey } };
        return fetch(this.baseUrl + path, requestOptions).then(response => response.json())
    }

    static async apiPost(path: string, data: any[]) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.apiKey, 'Content-Type': 'application/json' },
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

}

