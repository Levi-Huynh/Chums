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

/*
function searchForPerson() {
    it('Search for Person', () => {
        cy.get('#searchText').type('Smith');
        cy.get('#searchButton').click();
        cy.get('body').should('contain', 'James Smith');
    });
    it('Load Person', () => {
        cy.get("a:contains('James Smith')").click();
        cy.get('body').should('contain', '555-6789');
    });
    it('Verify Household Members', () => { cy.get('body').should('contain', 'Linda Smith'); });
    it('Verify Group Membership', () => { cy.get('body').should('contain', 'Homebuilders'); });
    it('Verify Tabs', () => {
        cy.get('body').should('contain', 'Notes')
            .should('contain', 'Attendance')
            .should('contain', 'Donations');
    });
}

function testEdit() {
    it('Edit Person', () => {
        cy.get('#personDetailsBox .header .fa-pencil-alt').click();
        cy.get('#personDetailsBox .footer .btn-success').should('exist');
        cy.get('#personDetailsBox input[name="email"]').clear().type('jsmith@chums.org');
        cy.get('#personDetailsBox .footer .btn-success').click();
        cy.get('#personDetailsBox').should('contain', 'jsmith@chums.org');
    });
}

function editHousehold() {
    it('Edit Household', () => {
        cy.get('#householdBox .fa-pencil-alt').click();
        cy.get('#householdBox .footer .btn-success').should('exist');
        cy.get('#householdBox input[name="householdName"]').type('Smith Test');
        cy.get('#householdBox .text-success').click();
        cy.get('#personAddText').should('exist').clear().type('Davis');
        cy.get('#personAddButton').click();
        cy.get('#householdMemberAddTable .text-success:first').should('exist').click();
        cy.get('#householdBox .footer .btn-success').click();
        cy.get('#householdMemberAddTable .text-success').should('not.exist');
        cy.get('#householdBox').should('contain', 'Davis');
    });
}

function addANote() {
    it('Add a note', () => {
        cy.get('#notesBox textarea').type('This is a test note');
        cy.get('#notesBox .footer .btn-success').click();
        cy.get('#notesBox p:contains("This is a test note")').should('exist');
        cy.get('#notesBox textarea').should('have.value', '');
    });
}

function editPhoto() {
    it('Edit Photo', () => {
        cy.get('#personDetailsBox .header .fa-pencil-alt').click();
        cy.get('#personDetailsBox .footer .btn-success').should('exist');
        cy.get('#imgPreview').click();
        cy.get('#cropperBox').should('exist');
        cy.wait(1000);
        cy.get('#cropperBox .btn-success').click();
        cy.wait(5000);
        cy.get('#personDetailsBox .footer .btn-success').click();
    });
}
*/