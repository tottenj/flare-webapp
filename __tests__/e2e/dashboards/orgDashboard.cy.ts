describe('Success Flow', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.loginTestOrgClient(); // ensure window auth ready
    cy.visit('/dashboard');
    cy.url().should('include', '/org/dashboard');
  });

  it('Tests success flow', () => {
    cy.get('[data-cy=profile-picture]').invoke('attr', 'src').as('oldSrc');

    cy.get('[data-cy=profile-pic-input]').selectFile('cypress/fixtures/avatar.webp', {
      force: true,
    });

    cy.get('@oldSrc').then((oldSrc) => {
      cy.get('[data-cy=profile-picture]', { timeout: 10000 })
        .invoke('attr', 'src')
        .should((newSrc) => {
          expect(newSrc).to.not.eq(oldSrc);
          expect(newSrc).to.match(/^https?:\/\//);
        });
    });
  });


  it('Persists profile picture after reload', () => {
    cy.get('[data-cy=profile-pic-input]').selectFile('cypress/fixtures/avatar.webp', {
      force: true,
    });

    cy.get('[data-cy=profile-picture]', { timeout: 10000 }).invoke('attr', 'src').as('newSrc');

    cy.reload();

    cy.get('@newSrc').then((src) => {
      cy.get('[data-cy=profile-picture]').invoke('attr', 'src').should('eq', src);
    });
  });
});
