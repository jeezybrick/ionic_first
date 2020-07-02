describe("Boards CRUD", () => {
    before(() => {
        cy.login();
        cy.saveLocalStorage();
    });

    beforeEach(() => {
       cy.restoreLocalStorage();
       cy.visit("/");

       cy.get('[data-cy=add-board-button]').as('showCreateBoardModalBtn');
    });

    it("Should create board successfully", () => {
        cy.get('@showCreateBoardModalBtn').click();
        cy.wait(300);
        cy.get('[data-cy=board-name-input]').as('boardNameInput');
        cy.get('[data-cy=create-board-submit]').as('createBoardSubmit');
        cy.get('[data-cy=users-autocomplete-input]').as('usersAutocompleteInput');

        cy.get('@boardNameInput').type('Board test name');
        cy.get('@usersAutocompleteInput').click();
        cy.wait(100);

        cy.get('[data-cy=users-autocomplete-item]').as('usersAutocompleteItem');
        cy.get('@usersAutocompleteItem').click();
        cy.wait(100);

        cy.get('@createBoardSubmit').click({force: true});
    });
});
