describe("Register", () => {
    it("should visit register page", () => {
        cy.viewport('iphone-6+')
        cy.wait(200)
        cy.visit("/auth/register");
        cy.get('#full-name').type('Андрей Стаценко');
        cy.get('#email').type('123@gmail.com');
        cy.get('#password').type('123456');
        cy.get('#repeat-password').type('123456');
        cy.wait(1000);
        cy.get('#submit-btn').click();
    });
});
