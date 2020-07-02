describe("Auth Guard", () => {
    before(() => {
        cy.viewport('iphone-6+');
    });

    it("No Auth user should be redirected to login page", () => {
        cy.visit("/");
        cy.url().should('include', '/login')
    });

    it("No Auth user should be redirected to login page", () => {
        cy.login();
        cy.saveLocalStorage();
        cy.visit("/");
        cy.url().should('include', '/tabs')
    });
});
