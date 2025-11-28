describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests success flow', () => {
    cy.intercept('POST', '/api/loginToken').as('token');
    cy.get("[data-cy='email-input']").type('test@gmail.com');
    cy.get("[data-cy='password-input']").type('password123');
    cy.contains('Submit').click();
    cy.wait('@token');
    cy.url({ timeout: 15000 }).should('include', '/confirmation');
  });
});
