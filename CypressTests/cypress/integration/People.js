context('People', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    it('Log into app', () => { cy.login() });
    searchForPerson();
    testEdit();
    editPhoto();
    editHousehold();
});

function searchForPerson() {
    it('Search for Person', () => { cy.loadPerson('James Smith') });
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