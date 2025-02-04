describe("로그인 페이지", () => {
  it("로그인 페이지 이동", () => {
    cy.visit("/");
    cy.title().should("eq", "kim nuber");
  });

  it("이메일,패스워드 validate 확인", () => {
    cy.visit("/");

    const emailElement = cy.get('input[name="email"]');
    const passwordElement = cy.get('input[name="password"]');

    emailElement.type("timekillman@gmail");

    cy.get('span[role="alert"]').should("have.text", "이메일 패턴이 안 맞음");
    emailElement.clear();

    cy.get('span[role="alert"]').should(
      "have.text",
      "이메일은 필수 입력 사항입니다."
    );

    emailElement.type("timekillman@gmail.com");

    passwordElement.type("123").clear();
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

    cy.clientLogin({
      email: reqLoginMutation.email,
      password: reqLoginMutation.password,
    });
  });
});
