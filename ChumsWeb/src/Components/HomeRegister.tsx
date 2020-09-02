import React from 'react';
import { ApiHelper, RegisterInterface, RoleInterface, LoginResponseInterface, RolePermissionInterface, RoleMemberInterface, ErrorMessages, EnvironmentHelper, ChurchInterface, CampusInterface, UserInterface, PersonInterface, HouseholdInterface, GroupInterface, GroupServiceTimeInterface, ServiceInterface, ServiceTimeInterface, FundInterface } from './';
import { Row, Col, Container, Button } from 'react-bootstrap'

export const HomeRegister: React.FC = () => {

    const [register, setRegister] = React.useState<RegisterInterface>({ churchName: '', displayName: '', password: '', email: '' });
    const [processing, setProcessing] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [errors, setErrors] = React.useState<string[]>([]);
    const [redirectUrl, setRedirectUrl] = React.useState('');

    const validateEmail = (email: string) => { return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)); }

    const validate = () => {
        var errors: string[] = [];
        if (register.churchName === '') errors.push('Please enter your church name.')
        if (firstName === '') errors.push('Please enter your first name.')
        if (lastName === '') errors.push('Please enter your last name.')
        if (register.password === '') errors.push('Please enter a password.');
        else if (register.password.length < 6) errors.push('Passwords must be at least 6 characters.');
        if (register.email === '') errors.push('Please enter your email address.');
        else if (!validateEmail(register.email)) errors.push('Please enter a valid email address');
        setErrors(errors);
        return errors.length === 0;
    }

    const handleRegister = async (e: React.MouseEvent) => {
        e.preventDefault();
        const btn = e.currentTarget;
        btn.innerHTML = "Validating..."
        btn.setAttribute("disabled", "disabled");
        if (validate()) {
            setProcessing(true);
            btn.innerHTML = "Registering. Please wait...";
            const churchId = await createAccess();

            btn.innerHTML = "Configuring...";

            var promises: Promise<any>[] = [];
            var campus: CampusInterface = { name: register.churchName };
            promises.push(ApiHelper.apiPost("/campuses", [campus]).then(c => campus = c));
            var household: HouseholdInterface = { name: lastName };
            promises.push(ApiHelper.apiPost("/households", [household]).then(h => household = h));
            var fund: FundInterface = { name: "General Fund" };
            promises.push(ApiHelper.apiPost("/funds", [fund]).then(f => fund = f));
            var group: GroupInterface = { name: "Worship Service", categoryName: "Worship Service", trackAttendance: true };
            promises.push(ApiHelper.apiPost("/groups", [group]).then(f => fund = f));
            await Promise.all(promises);

            promises = [];
            var person: PersonInterface = { contactInfo: { email: register.email }, name: { first: firstName, last: lastName }, householdId: household.id, householdRole: "Head" };
            promises.push(ApiHelper.apiPost("/people", [person]).then(p => person = p));
            var service: ServiceInterface = { campusId: campus.id, name: "Sunday Morning" };
            promises.push(ApiHelper.apiPost("/services", [service]).then(s => service = s));
            await Promise.all(promises);

            var serviceTime: ServiceTimeInterface = { name: "9:00", serviceId: service.id };
            await ApiHelper.apiPost("/servicetimes", [serviceTime]).then(st => serviceTime = st)

            var groupServiceTime: GroupServiceTimeInterface = { groupId: group.id, serviceTimeId: serviceTime.id };
            await ApiHelper.apiPost("/groupservicetimes", [groupServiceTime]).then(gst => groupServiceTime = gst)

            //setRedirectUrl(EnvironmentHelper.AppUrl);
        }

        btn.innerHTML = "Register"
        btn.removeAttribute("disabled");
        setProcessing(false);
    }


    const createAccess = async () => {
        register.displayName = firstName + " " + lastName;

        var resp: LoginResponseInterface = await ApiHelper.apiPostAnonymous(EnvironmentHelper.AccessManagementApiUrl + '/churches/register', register);
        const church = resp.churches[0];
        ApiHelper.jwt = resp.token;

        await addAdminRole(church, resp.user)

        resp = await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/users/switchApp', { churchId: church.id, appName: "StreamingLive" });
        ApiHelper.jwt = resp.token;

        return church.id;
    }

    const addAdminRole = async (church: ChurchInterface, user: UserInterface) => {
        var role: RoleInterface = { appName: "StreamingLive", churchId: church.id, name: "Admins" };
        role.id = (await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/roles', [role]))[0].id;

        const member: RoleMemberInterface = { churchId: church.id, roleId: role.id, userId: user.id };
        member.id = (await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/rolemembers', [member]))[0].id;

        const permissions: RolePermissionInterface[] = [];
        permissions.push({ churchId: church.id, contentType: "Attendance", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Attendance", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Attendance", action: "View Summary", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Donations", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Donations", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Donations", action: "View Summary", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Forms", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Forms", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Group Members", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Group Members", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Groups", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Groups", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Households", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "People", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "People", action: "Edit Notes", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "People", action: "View Notes", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Groups", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Groups", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Roles", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "RoleMembers", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "RoleMembers", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "RolePermissions", action: "View", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "RolePermissions", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Services", action: "Edit", roleId: role.id });
        permissions.push({ churchId: church.id, contentType: "Admin", action: "Import", roleId: role.id });
        await ApiHelper.apiPost(EnvironmentHelper.AccessManagementApiUrl + '/rolepermissions', permissions);
    }


    const getProcessing = () => {
        if (!processing) return null;
        else return <div className="alert alert-info" role="alert"><b>Registering...</b> Please wait.  This will take a few seconds.</div>
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        var r = { ...register };
        switch (e.currentTarget.name) {
            case 'churchName': r.churchName = val; break;
            case 'firstName': setFirstName(val); break;
            case 'lastName': setLastName(val); break;
            case 'email': r.email = val; break;
            case 'password': r.password = val; break;
        }
        setRegister(r);
    }

    if (redirectUrl === '') {
        return (
            <div className="homeSection" id="registerSection">
                <Container>
                    <div id="register"></div>

                    <Row>
                        <Col lg={6} className="d-none d-lg-block" ><img src="/images/home/register.png" alt="register" className="img-fluid" /></Col>
                        <Col lg={6}>
                            <div className="title"><span>Join CHUMS</span></div>
                            <h2>Register for a Free Account</h2>
                            <p>You'll be up and running in less than a minute.</p>

                            {getProcessing()}
                            <ErrorMessages errors={errors} />
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Church Name" name="churchName" value={register.churchName} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="First Name" name="firstName" value={firstName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={lastName} onChange={handleChange} />
                            </div>


                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Email" name="email" value={register.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="Password" name="password" value={register.password} onChange={handleChange} />
                            </div>
                            <Button variant="success" block onClick={handleRegister}>Get Started for Free</Button>


                        </Col>
                    </Row>
                </Container>
            </div >
        );
    } else {
        window.location.href = redirectUrl;
        return (<></>);
    }
}
