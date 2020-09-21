import { EnvironmentHelper } from "./";


export interface AnswerInterface { id?: number, value?: string, questionId?: number, formSubmissionId?: number }
export interface AttendanceInterface { campus: CampusInterface, service: ServiceInterface, serviceTime: ServiceTimeInterface, group: GroupInterface }
export interface AttendanceRecordInterface { group: GroupInterface, serviceTime: ServiceTimeInterface, service: ServiceInterface, campus: CampusInterface, week: number, count: number, visitDate: Date, gender?: string }
export interface CampusInterface { id?: number, name?: string }
export interface ContactInfoInterface { address1?: string, address2?: string, city?: string, state?: string, zip?: string, homePhone?: string, mobilePhone?: string, workPhone?: string, email?: string }
export interface DonationBatchInterface { id?: number, name?: string, batchDate?: Date, donationCount?: number, totalAmount?: number }
export interface DonationInterface { id?: number, batchId?: number, personId?: number, donationDate?: Date, amount?: number, method?: string, methodDetails?: string, notes?: string, person?: PersonInterface, fund?: FundInterface }
export interface DonationSummaryInterface { week?: number, totalAmount?: number, fund: FundInterface }
export interface FormInterface { id?: number, name?: string, contentType?: string }
export interface FormSubmissionInterface { id?: number, formId?: number, contentType?: string, contentId?: number, form?: FormInterface, answers?: AnswerInterface[], questions?: QuestionInterface[] }
export interface FundInterface { id: number, name: string }
export interface FundDonationInterface { id?: number, donationId?: number, fundId?: number, amount?: number, donation?: DonationInterface }
export interface GroupInterface { id?: number, name?: string, categoryName: string, memberCount: number, trackAttendance: boolean, parentPickup: boolean }
export interface GroupMemberInterface { id?: number, personId: number, person?: PersonInterface, groupId: number, group?: GroupInterface }
export interface GroupServiceTimeInterface { id?: number, groupId?: number, serviceTimeId?: number, serviceTime?: ServiceTimeInterface }
export interface HouseholdInterface { id?: number, name?: string }
export interface HouseholdMemberInterface { id?: number, householdId?: number, household?: HouseholdInterface, personId?: number, person?: PersonInterface, role?: string }
export interface NameInterface { first?: string, middle?: string, last?: string, nick?: string, display?: string }
export interface NoteInterface { dateAdded?: string, person?: PersonInterface }
export interface PermissionInterface { contentType?: string, action?: string }
export interface PersonInterface { id?: number, name: NameInterface, contactInfo: ContactInfoInterface, membershipStatus?: string, gender?: string, birthDate?: Date, maritalStatus?: string, anniversary?: Date, photo?: string, photoUpdated?: Date, householdId?: number, householdRole?: string, userId?: number, formSubmissions?: [FormSubmissionInterface] }
export interface QuestionInterface { id?: number, formId?: number, title?: string, fieldType?: string, placeholder?: string, description?: string, choices?: [{ value?: string, text?: string }] }
export interface RegisterInterface { churchName?: string, firstName?: string, lastName?: string, email?: string, password?: string }
export interface ServiceInterface { id: number, campusId: number, name: string }
export interface ServiceTimeInterface { id: number, name: string, longName?: string, serviceId: number }
export interface SessionInterface { id: number, groupId: number, serviceTimeId: number, sessionDate: Date, displayName: string }
export interface UserInterface { id?: number, name: string }
export interface VisitInterface { id?: number, personId?: number, serviceId?: number, groupId?: number, visitDate?: Date, visitSessions?: VisitSessionInterface[], person?: PersonInterface }
export interface VisitSessionInterface { id?: number, visitId?: number, sessionId?: number, visit?: VisitInterface, session?: SessionInterface }

//AccessManagment
export interface ApplicationInterface { name: string, permissions: RolePermissionInterface[] }
export interface ChurchInterface { id?: number, name: string, registrationDate?: Date, apps?: ApplicationInterface[] }
export interface LoginResponseInterface { user: UserInterface, churches: ChurchInterface[], token: string }
export interface RegisterInterface { churchName?: string, displayName?: string, email?: string, password?: string }
export interface RoleInterface { id?: number, churchId?: number, appName?: string, name?: string }
export interface RolePermissionInterface { id?: number, churchId?: number, roleId?: number, appName?: string, contentType?: string, contentId?: number, action?: string }
export interface RoleMemberInterface { id?: number, churchId?: number, roleId?: number, userId?: number, user?: UserInterface }
export interface ResetPasswordRequestInterface { userEmail: string, fromEmail: string, subject: string, body: string }
export interface ResetPasswordResponseInterface { emailed: boolean }
export interface SwitchAppRequestInterface { appName: string, churchId: number }
export interface SwitchAppResponseInterface { appName: string, churchId: number }
export interface UserInterface { id?: number, email?: string, authGuid?: string, displayName?: string, registrationDate?: Date, lastLogin?: Date, password?: string }

export class ApiHelper {
    static jwt = '';
    static amJwt = '';

    static getUrl(path: string) {
        if (path.indexOf("://") > -1) return path;
        else return EnvironmentHelper.ChumsApiUrl + path;
    }

    static getAccessUrl(path: string) {
        if (path.indexOf("://") > -1) return path;
        else return EnvironmentHelper.AccessManagementApiUrl + path;
    }

    static async apiGet(path: string) {
        try {
            const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.jwt } };
            return fetch(this.getUrl(path), requestOptions).then(response => response.json())
        } catch (e) {
            throw (e);
        }
    }

    static async accessGet(path: string) {
        try {
            const requestOptions = { method: 'GET', headers: { 'Authorization': 'Bearer ' + this.amJwt } };
            return fetch(this.getAccessUrl(path), requestOptions).then(response => response.json())
        } catch (e) {
            throw (e);
        }
    }

    static async apiPost(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.jwt, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
    }

    static async accessPost(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.amJwt, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.getAccessUrl(path), requestOptions).then(response => response.json())
    }

    static async apiDelete(path: string) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.jwt }
        };
        return fetch(this.getUrl(path), requestOptions);
    }

    static async accessDelete(path: string) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.amJwt }
        };
        return fetch(this.getAccessUrl(path), requestOptions);
    }

    static async apiPostAnonymous(path: string, data: any[] | {}) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        return fetch(this.getUrl(path), requestOptions).then(response => response.json())
    }

}
