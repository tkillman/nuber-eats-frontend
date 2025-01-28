describe("프로필수정", () => {
  const loginEmail = "test@gmail.com";
  const loginPassword = "test1234";

  beforeEach(() => {
    cy.visit("/");
    cy.clientLogin({ email: loginEmail, password: loginPassword });
    cy.get('a[href="/my-profile"]').click();
  });

  it("프로필 화면 이동", () => {
    cy.checkPath("/my-profile");
    cy.get('input[name="email"]').should("have.value", loginEmail);
  });

  it("프로필 수정테스트", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        req.reply((res) => {
          res.send({
            fixture: "auth/edit-profile-client.json",
          });
        });
      }
    }).as("editProfile");

    cy.get('input[name="email"]').clear().type("test2@gmail");
    cy.findByRole("alert").should("have.text", "이메일 패턴이 안 맞음");
    cy.get('input[name="email"]').clear().type("test2@gmail.com");

    cy.get('input[name="password"]').type("123").clear();
    cy.findByRole("alert").should("have.text", "Password is required");
    cy.get('input[name="password"]').type("123");
    cy.get("button").should("not.have.class", "pointer-events-none").click();

    cy.wait("@editProfile");
    cy.checkPath("/");
  });
});
