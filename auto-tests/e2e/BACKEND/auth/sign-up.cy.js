"use strict";
const backendUrl = Cypress.env('backendUrl');
const validEmail = 'test.user@example.com';
const invalidEmail = '.test.user@example.com';
const validPassword = 'Password123.';
const invalidPassword = '1234567';

describe ("Sign-up test", () => {
    it ("Positive sign-up test", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/sign-up/`,
            body: {
                email: validEmail,
                password: validPassword,
                password2: validPassword,
            },
          }).then((response) => {
            expect(response.status).to.eq(201)
        });
    });

    // it ("Delete test user", () => {
    //     cy.request({
    //         method: 'DELETE',
    //         url: `${backendUrl}/api/auth/`,
    //         body: {
    //             
    //             
    //             
    //         },
    //       }).then((response) => {
    //         expect(response.status).to.eq(200)
    //     });
    // });

    it ("Sign-up with incorrect method", () => {
        cy.request({
            method: 'GET',
            url: `${backendUrl}/api/auth/sign-up/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: validPassword,
                password2: validPassword,
            },
          }).then((response) => {
            expect(response.status).to.eq(405)
        });
    });

    it ("Sign-up with invalid email", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/sign-up/`,
            failOnStatusCode: false,
            body: {
                email: invalidEmail,
                password: validPassword,
                password2: validPassword,
            },
          }).then((response) => {
            expect(response.status).to.eq(400)
        });
    });

    it ("Sign-up with mismatched passwords", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/sign-up/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: validPassword,
                password2: 'Password12345.',
            },
          }).then((response) => {
            expect(response.status).to.eq(400)
        });
    });

    it ("Sign-up with missing password", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/sign-up/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: '',
                password2: '',
            },
          }).then((response) => {
            expect(response.status).to.eq(400)
        });
    });

    it ("Sign-up with invalid password", () => {
        cy.request({
            method: 'POST',
            url: `${backendUrl}/api/auth/sign-up/`,
            failOnStatusCode: false,
            body: {
                email: validEmail,
                password: invalidPassword,
                password2: invalidPassword,
            },
          }).then((response) => {
            expect(response.status).to.eq(400)
        });
    });

});