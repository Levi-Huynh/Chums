export interface AnswerInterface { id?: number, value?: string }
export interface AttendanceInterface { campus: CampusInterface, service: ServiceInterface, serviceTime: ServiceTimeInterface, group: GroupInterface }
export interface AttendanceRecordInterface { group: GroupInterface, serviceTime: ServiceTimeInterface, service: ServiceInterface, campus: CampusInterface, week: number, count: number, visitDate: Date }
export interface CampusInterface { id?: number, name?: string }
export interface ChurchInterface { id?: number }
export interface DonationBatchInterface { id?: number, name?: string, batchDate?: Date, donationCount?: number, totalAmount?: number }
export interface DonationInterface { id?: number, batchId?: number, personId?: number, donationDate?: Date, amount?: number, method?: string, methodDetails?: string, notes?: string, person?: PersonInterface, fund?: FundInterface }
export interface DonationSummaryInterface { week?: number, totalAmount?: number, fund: FundInterface }
export interface FormInterface { id?: number, name?: string, contentType?: string }
export interface FormSubmissionInterface { id?: number, formId?: number, contentType?: string, contentId?: number, form?: FormInterface, answers?: AnswerInterface[], questions?: QuestionInterface[] }
export interface FundInterface { id: number, name: string }
export interface FundDonationInterface { id?: number, donationId?: number, fundId?: number, amount?: number, donation?: DonationInterface }
export interface GroupInterface { id?: number, name?: string, categoryName: string, memberCount: number, trackAttendance: boolean }
export interface GroupMemberInterface { id?: number, personId: number, person?: PersonInterface, group?: GroupInterface }
export interface GroupServiceTimeInterface { id?: number, groupId?: number, serviceTimeId?: number, serviceTime?: ServiceTimeInterface }
export interface HouseholdInterface { id?: number, name?: string }
export interface HouseholdMemberInterface { id?: number, householdId?: number, household?: HouseholdInterface, personId?: number, person?: PersonInterface, role?: string }
export interface NoteInterface { dateAdded?: string, person?: PersonInterface }
export interface PermissionInterface { contentType?: string, action?: string }
export interface PersonInterface { id?: number, firstName?: string, middleName?: string, lastName?: string, nickName?: string, displayName?: string, membershipStatus?: string, gender?: string, birthDate?: Date, maritalStatus?: string, anniversary?: Date, address1?: string, address2?: string, city?: string, state?: string, zip?: string, homePhone?: string, mobilePhone?: string, workPhone?: string, email?: string, formSubmissions?: [FormSubmissionInterface], photo?: string, photoUpdated?: Date }
export interface QuestionInterface { id?: number, title?: string, fieldType?: string, placeholder?: string, description?: string, choices?: [{ value?: string, text?: string }] }
export interface RegisterInterface { churchName?: string, firstName?: string, lastName?: string, email?: string, password?: string }
export interface RoleInterface { id: number, name: string }
export interface RoleMemberInterface { id?: number, roleId: number, personId: number, person?: PersonInterface, role?: RoleInterface }
export interface RolePermissionInterface { id?: number, roleId: number, contentType: string, action: string }
export interface ServiceInterface { id: number, campusId: number, name: string }
export interface ServiceTimeInterface { id: number, name: string, longName?: string, serviceId: number }
export interface SessionInterface { id: number, groupId: number, serviceTimeId: number, sessionDate: Date, displayName: string }
export interface UserMappingInterface { church?: ChurchInterface, personId?: number }
export interface UserInterface { apiKey: string, name: string }
export interface VisitInterface { id?: number, personId?: number, serviceId?: number, groupId?: number, visitDate?: Date, visitSessions?: VisitSessionInterface[], person?: PersonInterface }
export interface VisitSessionInterface { id?: number, visitId?: number, sessionId?: number, visit?: VisitInterface, session?: SessionInterface }

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

