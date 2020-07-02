describe("Login", () => {
    let user;

    beforeEach(() => {
        cy.visit("/auth/login");

        cy.fixture('user').then(data => {
            user = data;
        });

        cy.server();
        cy.route('POST', '**/auth/login').as('postLogin');
        cy.get('[data-cy=submit]').as('submitBtn');
    });

    it("submit button should be disabled initially", () => {
        cy.get('@submitBtn').should('have.class', 'button-disabled');
    });

    it("submit button should be disabled if incorrect email", () => {
        cy.get('#email').type('123');
        cy.get('#password').type('123');
        cy.get('@submitBtn').should('have.class', 'button-disabled');
    });

});
