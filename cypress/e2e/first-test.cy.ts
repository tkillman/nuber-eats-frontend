describe("로그인 페이지", () => {
  it("로그인 페이지 이동", () => {
    cy.visit("/").title().should("eq", "kim nuber");
  });

  it("폼 입력", () => {
    cy.visit("/")
      .get('input[name="email"]')
      .type("timekillman@gmail.com")
      .get('input[name="password"]')
      .type("1234")
      .get("button")
      .should("not.have.class", "pointer-events-none");
  });

  it("이메일 형식 확인", () => {
    cy.visit("/")
      .get('input[name="email"]')
      .type("timekillman@gmail")
      .get('span[role="alert"]')
      .should("have.text", "이메일 패턴이 안 맞음");
  });
});
