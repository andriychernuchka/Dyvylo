describe('Catalog Skeleton E2E', () => {
  beforeEach(() => {
    cy.visit('/catalog');
  });

  it('renders catalog page with filter and media grid', () => {
    cy.get('[data-testid="catalog-page"]').should('be.visible');
    cy.get('[data-testid="filter-panel"]').should('be.visible');
    cy.get('[data-testid="media-grid"]').should('be.visible');
    cy.get('[data-testid="media-card"]').should('have.length.at.least', 1);
  });

  it('navigates from catalog to title page on item click', () => {
    cy.get('[data-testid="media-card"] a').first().click();
    cy.url().should('include', '/title/');
    cy.get('[data-testid="title-page"]').should('be.visible');
    cy.contains('Деталі релізу').should('exist');
  });
});
