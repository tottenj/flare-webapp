
describe("Success Flow", () => {
    beforeEach(() => {
        cy.loginTestOrg()
        cy.visit("/dashboard")
    })

    it("Tests success flow", () => {
        cy.url().should('include', '/org/dashboard');

    })
})