describe("로그인 페이지", () => {
  it("로그인 페이지 이동", () => {
    cy.visit("/");
    cy.title().should("eq", "kim nuber");
  });

  it("이메일,패스워드 validate 확인", () => {
    cy.visit("/");

    const email = cy.get('input[name="email"]');
    const password = cy.get('input[name="password"]');

    email.get('input[name="email"]').type("timekillman@gmail");

    cy.get('span[role="alert"]').should("have.text", "이메일 패턴이 안 맞음");
    email.clear();

    cy.get('span[role="alert"]').should(
      "have.text",
      "이메일은 필수 입력 사항입니다."
    );

    email.get('input[name="email"]').type("timekillman@gmail.com");

    password.type("123").clear();
    cy.get('span[role="alert"]').should(
      "have.text",
      "비밀번호는 필수 입력 사항입니다."
    );
  });

  it("정상 로그인 테스트", () => {
    const reqLoginMutation = {
      email: "timekillman@gmail.com",
      password: "111111",
    };

    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "loginMutation") {
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
    }).as("loginApi");

    cy.visit("/");
    cy.get('input[name="email"]').type(reqLoginMutation.email);
    cy.get('input[name="password"]').type(reqLoginMutation.password);
    cy.get("button").should("not.have.class", "pointer-events-none").click();

    cy.wait("@loginApi")
      .its("request.body.variables.loginInput")
      .then((input) => {
        console.log(input);
        expect(input.email).to.eq(reqLoginMutation.email);
        expect(input.password).to.eq(reqLoginMutation.password);
      });

    cy.window().its("sessionStorage.token").should("be.a", "string");
  });
});
