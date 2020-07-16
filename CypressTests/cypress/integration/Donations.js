context('Donations', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    it('Log into app', () => { cy.login() });
    it('Load attendance tab', () => { cy.loadTab('donationsTab', 'donationChartBox'); });
    donationChart();
    editFund();
    editBatchName();
    loadBatchPage();
    editDonation();
});

function donationChart() {
    it('Donation chart shown', () => { cy.get('#donationChartBox svg').should('exist'); });
    it('Filter chart', () => {
        cy.get('#attendanceFilterBox input[name="week"]').should('exist').clear().type('2020-06-28');
        cy.get('#attendanceFilterBox .footer .btn-success').click();
    });
    it('Donation chart not shown', () => { cy.get('#donationChartBox svg').should('exist'); });
}

function editFund() {
    it('Edit Fund', () => {
        cy.get('#fundsBox tr:contains("General Fund"):first .fa-pencil-alt').should('exist').click();
        cy.get('#fundsBox input[name="fundName"]').should('exist').clear().type('General Fund 2');
        cy.get('#fundsBox .footer .btn-success').click();
        cy.get('#fundsBox tr:contains("General Fund 2"):first .fa-pencil-alt').should('exist').click();
        cy.get('#fundsBox input[name="fundName"]').should('exist').clear().type('General Fund');
        cy.get('#fundsBox .footer .btn-success').click();
    });
}

function editBatchName() {
    it('Edit batch name', () => {
        cy.get('#batchesBox tr:contains("1"):first .fa-pencil-alt').should('exist').click();
        cy.get('#batchBox input[name="name"]').should('be.visible')
        cy.wait(250);
        cy.get('#batchBox input[name="name"]').clear().type('Batch One');
        cy.get('#batchBox .footer .btn-success').click();

        cy.get('#batchesBox tr:contains("Batch One"):first .fa-pencil-alt').should('exist');
        cy.wait(250);
        cy.get('#batchesBox tr:contains("Batch One"):first .fa-pencil-alt').click();
        cy.get('#batchBox input[name="name"]').should('be.visible')
        cy.wait(250);
        cy.get('#batchBox input[name="name"]').clear().type('1');
        cy.get('#batchBox .footer .btn-success').click();
    });
}

function loadBatchPage() {
    it('Load batch page', () => {
        cy.get('#batchesBox tr:contains("Jun 27, 2020"):first a:first').should('exist').click();
        cy.get('#donationsBox').should('exist');
    });
}

function editDonation() {
    it('Edit donation', () => {
        //Change donor to Anonymous
        cy.get('#donationsBox tr:contains("$400"):first a:first').should('exist').click();
        cy.get('#donationBox').should('be.visible');
        cy.get('#donationBox a:contains("James Smith")').should('exist').click();
        cy.get('#donationBox a:contains("Anonymous")').should('exist').click();
        cy.get('#donationBox .footer .btn-success').click();
        cy.wait(1500);

        //Change it back
        cy.get('#donationsBox tr:contains("$400"):contains("Anonymous"):first a:first').should('exist').click();
        cy.get('#donationBox').should('be.visible');
        cy.get('#donationBox a:contains("Anonymous")').should('exist').click();
        cy.get('#personAddText').should('exist').clear().type('James Smith');
        cy.get('#personAddButton').should('exist').click();
        cy.get('#donationBox tr:contains("James Smith"):first a.text-success').should('exist').click();
        cy.get('#donationBox .footer .btn-success').click();
        cy.get('#donationsBox tr:contains("James Smith"):first a:first').should('exist');
    });
}