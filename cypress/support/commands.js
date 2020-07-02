// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-localstorage-commands";

Cypress.Commands.add("login", (email, password) => {
    cy.request({
        method: 'POST',
        url: Cypress.config('apiUrl') + '/api/auth/login',
        body: {
            email: email || '123@gmail.com',
            password: password || '123456',
        },
    }).its('body')
        .then((res) => {
        cy.setLocalStorage("Token", res.token);
    })
})
