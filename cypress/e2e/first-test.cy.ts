describe("First test", () => {
  it("should go homepage", () => {
    cy.visit("http://localhost:3000")
      .title()
      .should("eq", "Login | Nuber Eats");
  });
});
