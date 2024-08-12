"use strict";
const backendUrl = Cypress.env('backendUrl');
const validEmail = 'user@example.com';
const validPassword = '12345678A.';

describe("Refresh token test", () => {
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

  it("Positive test. Refresh access token", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/token/refresh/`,
      body: {
        refresh: refreshToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('access');
    });
  });

  it("Negative test. Refresh with blacklisted token", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/logout/`,
      failOnStatusCode: false,
      body: {
        refresh: refreshToken,
      },
    }).then(() => {
      cy.request({
        method: 'POST',
        url: `${backendUrl}/api/auth/token/refresh/`,
        failOnStatusCode: false,
        body: {
          refresh: refreshToken,
        },
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

});
