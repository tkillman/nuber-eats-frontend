describe("회원가입 페이지", () => {
  // 회원가입 페이지 이동
  it("이메일,패스워드 validate 확인", () => {
    cy.visit("/");
    cy.findByText("Create an Account").click();

    const email = cy.get('input[name="email"]');
    const password = cy.get('input[name="password"]');

    email.get('input[name="email"]').type("timekillman@gmail");

    cy.get('span[role="alert"]').should("have.text", "이메일 패턴이 안 맞음");
    email.clear();

    cy.get('span[role="alert"]').should("have.text", "Email is required");

    email.get('input[name="email"]').type("timekillman@gmail.com");

    password.type("123").clear();
    cy.get('span[role="alert"]').should("have.text", "Password is required");
  });

  it("정상 회원가입 테스트", () => {
    const emailValue = "test@gmail.com";
    const passwordValue = "111111";

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "createUser") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });

    cy.visit("/create-account");
    cy.get('input[name="email"]').type(emailValue);
    cy.get('input[name="password"]').type(passwordValue);
    cy.get('select[name="role"]').select("Owner");
    cy.get("button").should("not.have.class", "pointer-events-none").click();

    cy.wait(1000);

    cy.login({ email: emailValue, password: passwordValue });
  });
});
