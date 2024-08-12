"use strict";
const backendUrl = Cypress.env('backendUrl');
const validEmail = 'user@example.com';
const validPassword = '12345678A.';

describe("User logout test", () => {
  let refreshToken;
  before(() => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/login/`,
      body: {
        email: validEmail,
        password: validPassword,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      refreshToken = response.body.refresh;
    });
  });

  it("Logout user", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/logout/`,
      body: {
        refresh: refreshToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
    });
  });

  it("Try to use blacklisted refresh token", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/token/refresh/`,
      failOnStatusCode: false,
      body: {
        refresh: refreshToken,
      }
    }).then((response) => {
      expect(response.status).to.eq(401)
    });
  });

});