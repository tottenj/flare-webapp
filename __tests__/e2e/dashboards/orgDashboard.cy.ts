describe('Success Flow', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.visit('/org/dashboard');
    cy.loginTestOrgClient();
  });

  it('Tests success flow', () => {
    cy.intercept('GET', '/org/dashboard?_rsc=*').as('rsc');

    cy.get('[data-cy=profile-pic-input]').selectFile('cypress/fixtures/avatar.webp', {
      force: true,
    });

    cy.wait('@rsc');
    cy.contains('.Toastify__toast', 'Successfully Uploaded File', {
      timeout: 10000,
    }).should('be.visible');

    cy.reload()
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
