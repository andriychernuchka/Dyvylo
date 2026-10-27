describe('Authentication Skeleton E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/auth');
  });

  it('renders login and registration forms', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="register-form"]').should('be.visible');
  });

  it('logs in operator and updates header with user profile link', () => {
    cy.get('#login-email').type('testuser@dyvylo.net');
    cy.get('#login-password').type('secretpass');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.url().should('include', '/profile');
    cy.get('[data-testid="profile-page"]').should('be.visible');
    cy.get('[data-testid="profile-header"]').should('contain.text', 'testuser');

    cy.get('[data-testid="nav-profile"]').should('be.visible');
    cy.get('[data-testid="nav-logout-btn"]').should('be.visible').click();

    cy.get('[data-testid="nav-auth-btn"]').should('be.visible');
    cy.get('[data-testid="nav-profile"]').should('not.exist');
  });
});
