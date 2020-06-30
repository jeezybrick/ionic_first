describe("Login", () => {
    let user;

    beforeEach(() => {
        cy.visit("/auth/login");

        cy.fixture('users').then((users) => {
            console.log(users);
        });

        cy.fixture('user').then(data => {
            user = data;
        });

        cy.server();
        cy.route('POST', '**/auth/login').as('postLogin');
    });

    it("submit button should be disabled initially", () => {
        cy.get('[data-cy=submit]').should('have.class', 'button-disabled');
    });

    it("submit button should be disabled if empty inputs", () => {
        console.log(cy.get('[data-cy=submit]'));

        // cy.get('#email').clear();
        // cy.get('#password').clear();
        // cy.get('#submit-btn').should('be.disabled');
    });

    it("submit button should be disabled if incorrect email", () => {
        cy.get('#email').type('123');
        cy.get('#password').type('123');
        cy.get('[data-cy=submit]').should('have.class', 'button-disabled');
    });

    it("submit button should be enabled if empty inputs", () => {
        cy.get('#email').type(user.email);
        cy.get('#password').type(user.password);
        cy.get('[data-cy=submit]').should('not.have.class', 'button-disabled');
    });


    // it("submit button should be disabled if empty inputs", () => {
    //     cy.get('#email').type(Cypress.config('username'));
    //     cy.get('#password').type(Cypress.config('password'));
    //     cy.get('#submit-btn').click();
    //     cy.wait('@postLogin');
    // });
});
