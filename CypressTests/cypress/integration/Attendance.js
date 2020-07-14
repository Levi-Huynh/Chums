context('People Functionality', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    logIntoApp();
    selectAttendance();
    editCampus();
    editService();
    editServiceTime();
    attendanceChart();
});

function logIntoApp() {
    it('Log Into App', () => {
        cy.visit('/');
        cy.get('#email').type(Cypress.env('email'));
        cy.get('#password').type(Cypress.env('password'));
        cy.get('#signInButton').click();
        cy.wait(1500);
        cy.get('body').should('contain', 'Search');
    });
    'groupsTab'
}

function selectAttendance() {
    it('Open sidebar', () => { cy.get('#sidebarToggle').should('exist').click(); });
    it('Load attendance tab', () => { cy.get('#attendanceTab').should('exist').click(); });
    it('Close sidebar', () => {
        cy.get('#sidebarToggle').should('exist').click();
        cy.get('#attendanceTab').should('not.be.visible')
    });
    it('Attendance is shown', () => {
        cy.wait(1000);
        cy.get('#groupsBox').should('exist');
    });

}

function editCampus() {
    it('Edit Campus', () => {
        cy.get('#groupsBox a:contains("Main Campus")').should('exist').click();
        cy.get('#campusBox').should('exist');
        cy.get('#campusName').should('exist').clear().type('Main Campus Test');
        cy.get('#campusBox .footer .btn-success').click();
        cy.get('#groupsBox a:contains("Main Campus Test")').should('exist').click();
        cy.get('#campusName').should('exist').clear().type('Main Campus');
        cy.get('#campusBox .footer .btn-success').click();
    });
}

function editService() {
    it('Edit Service', () => {
        cy.get('#groupsBox a:contains("Sunday"):first').should('exist').click();
        cy.get('#serviceBox').should('exist');
        cy.get('#serviceBox input[name="serviceName"]').should('exist').clear().type('Sunday Test');
        cy.get('#serviceBox .footer .btn-success').click();
        cy.get('#groupsBox a:contains("Sunday Test"):first').should('exist').click();
        cy.get('#serviceBox input[name="serviceName"]').should('exist').clear().type('Sunday');
        cy.get('#serviceBox .footer .btn-success').click();
    });
}

function editServiceTime() {
    it('Edit Service Time', () => {
        cy.get('#groupsBox a:contains("10:30am"):first').should('exist').click();
        cy.get('#serviceTimeBox').should('exist');
        cy.get('#serviceTimeBox input[name="serviceTimeName"]').should('exist').clear().type('10:31am');
        cy.get('#serviceTimeBox .footer .btn-success').click();
        cy.get('#groupsBox a:contains("10:31am"):first').should('exist').click();
        cy.get('#serviceTimeBox input[name="serviceTimeName"]').should('exist').clear().type('10:30am');
        cy.get('#serviceTimeBox .footer .btn-success').click();
    });
}

function attendanceChart() {
    it('Chart is blank', () => { cy.get('#attendanceBox').should('contain', 'No records found.'); });
    it('Switch to people tab', () => {
        cy.get("#attendanceTabs .nav-link:contains('People')").should('exist').should('not.have.class', 'active').click().should('have.class', 'active');
        cy.get('#attendanceBox').should('not.be.visible');
        cy.get('#individualAttendanceBox').should('be.visible');
    });
    it('No people shown', () => { cy.get('#individualAttendanceBox').should('contain', 'Total Attendance: 0'); });
    it('Filter attendance', () => {
        cy.get('#attendanceFilterBox input[name="week"]').should('exist').clear().type('2020-06-28');
        cy.get('#attendanceFilterBox .footer .btn-success').click();
    });
    it('People shown', () => { cy.get('#individualAttendanceBox').should('not.contain', 'Total Attendance: 0'); });
    it('Switch to attendance tab', () => {
        cy.get("#attendanceTabs .nav-link:contains('Attendance')").should('exist').should('not.have.class', 'active').click().should('have.class', 'active');
        cy.get('#attendanceBox').should('be.visible');
    });
    it('Attendance rows shown', () => { cy.get('#attendanceBox').should('contain', 'Test Church'); });
    it('Attendance chart shown', () => { cy.get('#attendanceBox svg').should('exist'); });
    it('Change chart grouping', () => {
        cy.get('#attendanceBox select').should('exist').select('Service Time');
        cy.get('#attendanceBox').should('contain', '10:30am');
    });
}