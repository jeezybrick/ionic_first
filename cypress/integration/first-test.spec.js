describe("First test", () => {
    it("should visit login page", () => {
        cy.visit("http://localhost:8100/auth/login");
    });
});
