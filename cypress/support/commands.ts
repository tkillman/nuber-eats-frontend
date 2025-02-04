/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      // 로그인 상태 확인
      assetsLogin: VoidFunction;
      // 로그아웃 테스트
      assetsLogout: VoidFunction;
      // 클라이언트 로그인 테스트
      clientLogin: ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => void;
      // 패스 확인
      checkPath: (path: string) => void;
    }
  }
}

Cypress.Commands.add("assetsLogout", () => {
  cy.window().its("sessionStorage.token").should("be.undefined");
});

Cypress.Commands.add("assetsLogin", () => {
  cy.window().its("sessionStorage.token").should("be.a", "string");
});

Cypress.Commands.add(
  "clientLogin",
  ({
    email,
    password,
    role = "Client",
  }: {
    email: string;
    password: string;
    role: "Client" | "Owner" | "Delivery";
  }) => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "loginMutation") {
        req.alias = "loginMutationRequest";
        req.reply((res) => {
          res.send({
            data: {
              login: {
                ok: true,
                token: "XXX",
                error: null,
                __typename: "LoginOutput",
              },
            },
          });
        });
      }
      if (req.body?.operationName === "me") {
        req.reply((res) => {
          res.send({
            data: {
              me: {
                id: 6,
                email: email,
                role: role,
                verified: false,
                __typename: "User",
              },
            },
          });
        });
      }
    });

    // 토큰이 없는 상태 확인
    cy.assetsLogout();

    // 홈페이지 url 이동
    cy.visit("/");
    // 여기서는 로그인 페이지로 이동했음
    cy.location("pathname").should("eq", "/login");

    // 이메일, 패스워드 입력
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);

    // 로그인 버튼 활성화 확인
    cy.get("button").should("not.have.class", "pointer-events-none").click();

    cy.wait("@loginMutationRequest")
      .its("request")
      .then((req) => {
        cy.wrap(req).its("body.variables.loginInput.email").should("eq", email);
        cy.wrap(req)
          .its("body.variables.loginInput.password")
          .should("eq", password);
      });

    cy.assetsLogin();
  }
);

Cypress.Commands.add("checkPath", (path) => {
  cy.location("pathname").should("eq", path);
});
