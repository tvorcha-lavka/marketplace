"use strict";
const backendUrl = Cypress.env('backendUrl');
const validEmail = 'user@example.com';
const validPassword = '12345678A.';
const wrongEmail = 'wrong.user@example.com';
const wrongPassword = '12345678Abc.new';

describe ("Positive login test", () => {
    it ("Login", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/login/`,
            body: {
                email: validEmail,
                password: validPassword,
            },
          }).then((response) => {
            expect(response.status).to.eq(200)
        });
    });
});

describe ("Negative login test", () => {
    it ("Login with wrong email", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/login/`,
            failOnStatusCode: false,
            body: {
                email: wrongEmail,
                password: validPassword,
            },
        }).then((response) => {
            expect(response.status).to.eq(401)
        });
    });

    it ("Login with wrong password", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/login/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: wrongPassword,
            },
        }).then((response) => {
            expect(response.status).to.eq(401)
        });
    });

    it ("Login with missing password", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/login/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: "",
            },
        }).then((response) => {
            expect(response.status).to.eq(400)
        });
    });

    it ("Login with incorrect method", () => {
        cy.request({
            method: 'GET',
            url: `${backendUrl}/api/auth/login/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: validPassword,
            },
          }).then((response) => {
            expect(response.status).to.eq(405)
        });
    });

});