import { pendingOrg } from "../constants";

describe("General", () => {
  it("Successfully Loads Org Dashboard", () => {
    cy.contains(pendingOrg.orgName).should("be.visible")
    cy.contains(pendingOrg.email).should("be.visible")
  })
})

describe('Profile Picture - Success Flow', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.reload()
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });

  it('Uploads profile picture successfully', () => {
    cy.get('[data-cy=profile-pic-input]').selectFile('cypress/fixtures/avatar.webp', {
      force: true,
    });

    cy.contains('.Toastify__toast', 'Successfully Uploaded File', {
      timeout: 10000,
    }).should('be.visible');

    cy.reload();
  });

  it('Persists profile picture after reload', () => {
    cy.get('[data-cy=profile-picture]', { timeout: 10000 }).invoke('attr', 'src').as('initialSrc');

    cy.reload();

    cy.get('@initialSrc').then((src) => {
      cy.get('[data-cy=profile-picture]').invoke('attr', 'src').should('eq', src);
    });
  });
});

describe("Profile Picture - Unsuccessful Flow", () => {
  beforeEach(() => {
    cy.clearStorage()
    cy.loginTestOrg();
    cy.reload()
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });


  it("fails on file too large", () => {
    cy.get('[data-cy=profile-pic-input]').selectFile({
      contents: Cypress.Buffer.alloc(10 * 1024 * 1024), // 10MB
      fileName: 'big-image.jpg',
      mimeType: 'image/jpeg',
      lastModified: Date.now(),
    }, {force:true});

    cy.contains('.Toastify__toast', 'Image must be under 5MB', {
      timeout: 10000,
    }).should('be.visible');
  })
})
