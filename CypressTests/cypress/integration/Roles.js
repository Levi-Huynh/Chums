context('Roles', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    cy.on('window:confirm', (str) => { return true; });
    it('Log into app', () => { cy.login() });
    it('Load settings tab', () => { cy.loadTab('settingsTab', 'settingsBoxes'); });
    createRole();
    addRemoveMember();
    editPermissions();
    deleteRole();
});

function createRole() {
    it('Select roles', () => {
        cy.get('#settingsBoxes .card-body:contains("Permissions")').should('be.visible').click();
        cy.wait(1000);
        cy.get('#rolesBox').should('exist');
    });
    it('Create a role', () => {
        cy.get('#rolesBox .header .fa-plus').click();
        cy.get('#roleBox input').clear().type('Test Role');
        cy.get('#roleBox .footer .btn-success').click();
        cy.get('#rolesBox a:contains("Test Role"):first').click();
    });
}

function addRemoveMember() {
    it('Add a member', () => {
        cy.wait(1000);
        cy.get('#personAddText').should('exist').clear().type('Joseph Rodriguez');
        cy.get('#personAddButton').click();
        cy.get('#roleMemberAddBox .text-success:first').should('exist').click();
        cy.get("#roleMemberTable tr:contains('Joseph Rodriguez') a.text-danger").should('exist');
    });

    it('Remove a member', () => {
        cy.get("#roleMemberTable tr:contains('Joseph Rodriguez') a.text-danger").should('exist').click();
        cy.get("#roleMemberTable tr:contains('Joseph Rodriguez') a.text-danger").should('not.exist');
    });

}

function editPermissions() {
    it('Edit Permissions', () => {
        cy.get('#rolePermissionsBox .form-check:contains("Edit"):first input').should('not.be.checked').click();
        cy.wait(1000);
        cy.get('#rolePermissionsBox .form-check:contains("Edit"):first input').should('be.checked').click();
        cy.wait(1000);
        cy.get('#rolePermissionsBox .form-check:contains("Edit"):first input').should('not.be.checked')
    });
}

function deleteRole() {
    it('Delete role', () => {
        cy.loadTab('settingsTab', 'settingsBoxes');
        cy.get('#settingsBoxes .card-body:contains("Permissions")').should('be.visible').click();
        cy.get('#rolesBox tr:contains("Test Role"):first .fa-pencil-alt').click();
        cy.wait(500);
        cy.get('#roleBox .footer .btn-danger').click();
        cy.get('#rolesBox').should('not.contain', 'Test Role');
    });
}
