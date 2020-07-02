describe("Login", () => {
    let user;

    beforeEach(() => {
        cy.visit("/auth/login");

        cy.fixture('user').then(data => {
            user = data;
        });

        cy.server();
        cy.route('POST', '**/auth/login').as('postLogin');

        cy.get('[data-cy=password]').as('testBtn')

        // cy.get('[data-cy=submit]').as('submitBtn')
    });

    it("submit button should be disabled initially", () => {
        console.log(cy.get('@testBtn'));
        cy.get('@testBtn').should('not.have.class', 'button-disabled');
        // cy.get('@submitBtn').should('have.class', 'button-disabled');
    });

    // it("submit button should be disabled if incorrect email", () => {
    //     cy.get('#email').type('123');
    //     cy.get('#password').type('123');
    //     cy.get('@submitBtn').should('have.class', 'button-disabled');
    // });
    //
    // it("submit button should be enabled if empty inputs", () => {
    //     cy.get('#email').type(user.email);
    //     cy.get('#password').type(user.password);
    //     cy.get('@submitBtn').should('not.have.class', 'button-disabled');
    //     // cy.get('[data-cy=submit]').should('not.have.class', 'button-disabled');
    // });

    // it("User should login successfully", () => {
    //     cy.get('#email').type(user.email);
    //     cy.get('#password').type(user.password);
    //     cy.get('[data-cy=submit]').click();
    //     cy.wait('@postLogin');
    //     cy.url().should('include', '/tabs');
    // });
});
