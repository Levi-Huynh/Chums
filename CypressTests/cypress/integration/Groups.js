context('People Functionality', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    logIntoApp();
    selectGroup();
    editGroup();
    removeAddMember();
    switchTabs();
    //editHousehold();
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

function selectGroup() {
    it('Open sidebar', () => { cy.get('#sidebarToggle').should('exist').click(); });
    it('Load groups tab', () => { cy.get('#groupsTab').should('exist').click(); });
    it('Close sidebar', () => {
        cy.get('#sidebarToggle').should('exist').click();
        cy.get('#groupsTab').should('not.be.visible')
    });
    it('Select a group', () => { cy.get("a:contains('Davis')").should('exist').click(); });
    it('Attendance not shown', () => {
        cy.wait(1000);
        cy.get('body')
            .should('not.contain', 'Sessions')
            .should('not.contain', 'Trends')
    });

}

function editGroup() {
    it('Edit Group', () => {
        cy.get('#groupDetailsBox .header .fa-pencil-alt').click();
        cy.get('#groupDetailsBox .footer .btn-success').should('exist');
        cy.get('#groupDetailsBox select[name="trackAttendance"]').select('Yes');
        cy.get('#groupDetailsBox .footer .btn-success').click();
        cy.get('#groupDetailsBox').should('contain', 'Yes');
    });
    it('Attendance is shown', () => {
        cy.wait(1000);
        cy.get('body')
            .should('contain', 'Sessions')
            .should('contain', 'Trends')
    });
}

function removeAddMember() {
    it('Remove a member', () => {
        cy.get("#groupMemberTable tr:contains('Joseph Rodriguez') a.text-danger").should('exist').click();
        cy.get("#groupMemberTable tr:contains('Joseph Rodriguez') a.text-danger").should('not.exist');
    });

    it('Add a member', () => {
        cy.wait(1000);
        cy.get('#personAddText').should('exist').clear().type('Joseph Rodriguez');
        cy.get('#personAddButton').click();
        cy.get('#personAddBox .text-success:first').should('exist').click();
        cy.get("#groupMemberTable tr:contains('Joseph Rodriguez') a.text-danger").should('exist');
    });
}

function switchTabs() {
    it('Show sessions', () => {
        cy.get("#groupSessionsBox").should('not.be.visible');
        cy.get(".nav-link:contains('Sessions')").should('exist').should('not.have.class', 'active').click().should('have.class', 'active');
        cy.get("#groupSessionsBox").should('be.visible');
    });

    it('Show trends', () => {
        cy.get("#attendanceBox").should('not.be.visible');
        cy.get(".nav-link:contains('Trends')").should('exist').should('not.have.class', 'active').click().should('have.class', 'active');
        cy.get("#attendanceBox").should('be.visible');
    });

}