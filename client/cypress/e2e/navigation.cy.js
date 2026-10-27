describe('Navigation and Routing Skeleton E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders home page with layout header and footer', () => {
    cy.get('[data-testid="home-page"]').should('be.visible');
    cy.get('[data-testid="site-header"]').should('be.visible');
    cy.get('[data-testid="site-footer"]').should('be.visible');
  });

  it('navigates between routes using header navigation links', () => {
    cy.get('[data-testid="nav-catalog"]').click();
    cy.url().should('include', '/catalog');
    cy.get('[data-testid="catalog-page"]').should('be.visible');

    cy.get('[data-testid="nav-player"]').click();
    cy.url().should('include', '/player');
    cy.get('[data-testid="player-page"]').should('be.visible');

    cy.get('[data-testid="nav-home"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('[data-testid="home-page"]').should('be.visible');
  });

  it('handles 404 unknown routes gracefully', () => {
    cy.visit('/non-existing-route-path');
    cy.get('[data-testid="not-found-page"]').should('be.visible');
    cy.contains('404').should('exist');
  });
});
