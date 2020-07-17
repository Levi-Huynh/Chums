context('Groups', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    it('Log into app', () => { cy.login() });
    it('Load attendance tab', () => { cy.loadTab('groupsTab', 'groupsBox'); });
    selectGroup();
    editGroup();
    removeAddMember();
    switchTabs();
    editHousehold();
});

function selectGroup() {
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