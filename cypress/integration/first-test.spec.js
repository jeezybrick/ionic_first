describe("First test", () => {
    it("should visit login page", () => {
        cy.visit("/auth/login");
        cy.get('#email').type('123@gmail.com');
        cy.get('#password').type('123456', {timeout: 3000});
        cy.get('.submit-button').click();
    });
});
