describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests success flow', () => {
    cy.url().should('include', '/signUp')
  });
});
