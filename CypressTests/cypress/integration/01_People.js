context('People Functionality', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    logIntoApp();
    searchForPerson();
    testEdit();
    //addANote();

});

function logIntoApp() {
    it('Log Into App', () => {
        cy.visit('/');

        cy.get('#email').type(Cypress.env('email'));
        cy.get('#password').type(Cypress.env('password'));
        cy.get('#signInButton').click();
        cy.wait(750);
        cy.get('body').should('contain', 'Search');
    });
}

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
        cy.get('body').should('contain', 'Notes');
        cy.get('body').should('contain', 'Attendance');
        cy.get('body').should('contain', 'Donations');
    });
}

function testEdit() {
    it('Edit Person', () => {
        cy.get('#personDetailsBox .fa-pencil-alt').click();
        cy.get('#personDetailsBox .btn-success').should('exist');
        cy.get('#personDetailsBox input[name="email"]').type('jsmith@chums.org');
        cy.get('#personDetailsBox .btn-success').click();
        cy.get('#personDetailsBox').should('contain', 'jsmith@chums.org');
    });
}

function addANote() {
    it('Add a note', () => {
        cy.get('#notesBox textarea').type('This is a test note');
        cy.get('#notesBox .btn-success').click();
        cy.get('#notesBox p:contains("This is a test note")').should('exist');
        cy.get('#notesBox textarea').should('have.value', '');
    });
}
