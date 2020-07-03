describe("Boards CRUD", () => {
    before(() => {
        cy.login();
        cy.saveLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.server();
        cy.route({method: 'POST', url: '**/boards'}).as('postCreateBoard');
        cy.route({method: 'GET', url: '**/boards'}).as('getBoardsList');
        cy.route({method: 'DELETE', url: '**/boards/*'}).as('deleteBoard');

        cy.visit("/").then(() => {
            cy.wait('@getBoardsList');
            cy.wait(1000);

            cy.get('[data-cy=board-item]').as('boardItem');
            cy.get('[data-cy=board-item-label]').as('boardItemLabel');
        });
    });

    afterEach(() => {
        cy.wait(1000);
    });

    it("Should create board successfully without attach user", () => {
        // const initLength = Cypress.$('[data-cy=board-item]').length;

        cy.get('@boardItem').its('length').then((initLength) => {
            cy.shadowGet('[data-cy=add-board-button]').shadowClick();
            cy.wait(300);
            cy.get('[data-cy=board-name-input]').as('boardNameInput');
            cy.get('[data-cy=create-board-submit]').as('createBoardSubmit');
            cy.get('[data-cy=users-autocomplete-input]').as('usersAutocompleteInput');

            cy.get('@boardNameInput').type('Board test name');

            // cy.get('@usersAutocompleteInput').click();
            // cy.wait(100);
            // cy.get('[data-cy=users-autocomplete-item]').as('usersAutocompleteItem');
            // cy.get('@usersAutocompleteItem').click();
            // cy.wait(100);

            cy.get('@createBoardSubmit').click({force: true});
            cy.wait('@postCreateBoard');

            cy.get('@boardItem').should('have.length', initLength + 1);

            cy.wait(100);
            cy.get('ion-toast').should('have.length', 1);
            cy.shadowGet('ion-toast').shadowFind('.toast-message').should('have.text', 'Доска упешно создана');
        });

    });

    it("Should remove board successfully", () => {

        cy.get('@boardItem').its('length').then((initLength) => {
            const lastElement = cy.get('@boardItem').last();
            lastElement.scrollIntoView().then(() => {
                cy.get('@boardItem').last().find('[data-cy=board-item-remove-option]').should('not.be.visible');
                cy.get('@boardItem')
                    .last()
                    .find('ion-label')
                    .swipe('right', 'left');
                cy.get('@boardItem').last().find('[data-cy=board-item-remove-option]').should('be.visible');
                cy.get('@boardItem').last().find('[data-cy=board-item-remove-option]').click({force: true});
                cy.wait('@deleteBoard');

                cy.get('@boardItem').should('have.length', initLength - 1);

                cy.wait(100);
                cy.get('ion-toast').should('have.length', 1);
                cy.shadowGet('ion-toast').shadowFind('.toast-message').should('have.text', 'Доска упешно удалена');
            });
        });
    });


});
