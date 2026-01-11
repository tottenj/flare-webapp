describe('Success Flow', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.visit('/dashboard');
    cy.loginTestOrgClient()
  });

  it('Tests success flow', () => {
    cy.url().should('include', '/org/dashboard');

    cy.get('[data-cy=profile-picture]').invoke('attr', 'src').as('oldSrc');

    cy.get('[data-cy=profile-pic-input]').selectFile('cypress/fixtures/avatar.webp', {
      force: true,
    });

    cy.get('[data-cy=profile-picture]', { timeout: 10000 })
      .invoke('attr', 'src')
      .should('not.eq', '@oldSrc')
      .and('contain', 'http://');
  });
});
