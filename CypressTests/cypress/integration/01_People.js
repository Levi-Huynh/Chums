context('Admin - Service Inactive', () => {
    logIntoApp();

});

function logIntoApp() {
    it('Log Into Admin', () => {
        cy.visit(Cypress.env('url'));

    });
}
