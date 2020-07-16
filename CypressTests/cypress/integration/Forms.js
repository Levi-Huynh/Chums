context('Forms', () => {
    Cypress.Cookies.defaults({ whitelist: ['.AspNetCore.Session', '.AspNetCore.Cookies'] })
    it('Log into App', () => { cy.login() });
    it('Load forms tab', () => { cy.loadTab('formsTab', 'formsBox'); });
    addAForm();
    loadQuestionsPage();
    addQuestions();
    reorderQuestions();
    addForm();
});


function addAForm() {
    it('Add a form', () => {
        cy.get('#formsBox .header .fa-plus').should('exist').click();
        cy.get('#formBox').should('exist');
    });
    it('Save a form', () => {
        cy.get('#formBox input[name="formName"]').should('exist').clear().type('Test Form');
        cy.get('#formBox select[name="contentType"]').should('exist').select('People')
        cy.get('#formBox .footer .btn-success').click();
        cy.get('#formBox').should('not.be.visible');
    });

}

function loadQuestionsPage() {
    it('Load questions page', () => {
        cy.get('#formsBox a:contains("Test Form")').should('exist').click();
        cy.get('#questionsBox').should('exist');
    });
}

function addQuestions() {
    it('Add a question', () => {
        cy.get('#questionsBox .header .fa-plus').should('exist').click();
        cy.get('#questionBox').should('exist');
        cy.get('#questionBox input[name="title"]').should('exist').clear().type('Text Question');
        cy.get('#questionBox input[name="description"]').should('exist').clear().type('Text Description');
        cy.get('#questionBox input[name="placeholder"]').should('exist').clear().type('Text Placeholder');
        cy.get('#questionBox .footer .btn-success').click();
        cy.get('#questionBox').should('not.be.visible');
        cy.get('#questionsBox').should('contain', 'Text Question');
    });
    it('Add second question', () => {
        cy.get('#questionsBox .header .fa-plus').should('exist').click();
        cy.get('#questionBox').should('exist');
        cy.get('#questionBox select[name="fieldType"]').should('exist').select('Multiple Choice')
        cy.get('#questionBox input[name="title"]').should('exist').clear().type('Select Question');
        cy.get('#questionBox input[name="description"]').should('exist').clear().type('Select Description');
        cy.get('#questionBox input[name="placeholder"]').should('not.be.visible');
        cy.get('#questionBox input[name="choiceValue"]').should('exist').clear().type('1');
        cy.get('#questionBox input[name="choiceText"]').should('exist').clear().type('Option One');
        cy.get('#addQuestionChoiceButton').click();
        cy.get('#questionBox input[name="choiceValue"]').should('exist').clear().type('2');
        cy.get('#questionBox input[name="choiceText"]').should('exist').clear().type('Option Two');
        cy.get('#addQuestionChoiceButton').click();
        cy.get('#questionBox .footer .btn-success').click();
        cy.get('#questionBox').should('not.be.visible');
        cy.get('#questionsBox').should('contain', 'Select Question');
    });
}

function reorderQuestions() {
    it('Move question down', () => {
        cy.get('#questionsBox tbody tr:first').should('contain', 'Text Question');
        cy.get('#questionsBox tbody tr:first .fa-arrow-down').should('exist').click();
        cy.get('#questionsBox tbody tr:first').should('contain', 'Select Question');
    });
    it('Move question up', () => {
        cy.get('#questionsBox tbody tr:last .fa-arrow-up').should('exist').click();
        cy.get('#questionsBox tbody tr:first').should('contain', 'Text Question');
    });
}

function addForm() {
    it('Load person', () => {
        cy.loadTab('peopleTab', 'peopleBox');
        cy.loadPerson('James Smith');
        cy.get('#personDetailsBox .header .fa-pencil-alt').click();
        cy.get('#personDetailsBox a:contains("Add a form")').should('exist').click();
        cy.get('#addFormName').should('exist').select('Test Form');
        cy.get('#addFormButton').should('exist').click();
    });
}
