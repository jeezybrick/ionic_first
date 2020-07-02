describe("Auth Guard", () => {
    it("No Auth user should be redirected to login page", () => {
        cy.visit("/");
        cy.url().should('include', '/login')
    });
});
