"use strict";
const backendUrl = Cypress.env('backendUrl');
const validEmail = 'user@example.com';
const validPassword = '12345678A.';
const wrongEmail = 'wrong.user@example.com';
const wrongPassword = '12345678Abc.new';

describe("Obtain tokens tests", () => {
  it("Positive test. Obtain tokens with valid data", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/token/obtain/`,
      body: {
        email: validEmail,
        password: validPassword,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('access'); 
      expect(response.body).to.have.property('refresh');
    });
  });

  it("Negative test. Obtain tokens with wrong data", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/token/obtain/`,
      failOnStatusCode: false,
      body: {
        email: wrongEmail,
        password: wrongPassword,
      },
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("Negative test. Obtain tokens with missing credentials", () => {
    cy.request({
      method: 'POST',
      url: `${backendUrl}/api/auth/token/obtain/`,
      failOnStatusCode: false,
      body: {
        email: "",
        password: "",
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
  
});
