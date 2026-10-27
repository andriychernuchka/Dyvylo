import React from 'react';
import { Badge } from './Badge';

describe('<Badge /> Component Unit Tests', () => {
  it('renders standard badge content', () => {
    cy.mount(<Badge>4K UHD</Badge>);
    cy.get('[data-testid="badge"]')
      .should('be.visible')
      .and('contain.text', '4K UHD')
      .and('have.class', 'badge-default');
  });

  it('renders rating badge variant', () => {
    cy.mount(<Badge variant="rating">★ 9.4</Badge>);
    cy.get('[data-testid="badge"]')
      .should('have.class', 'badge-rating')
      .and('contain.text', '★ 9.4');
  });

  it('renders live status badge with pulsing dot', () => {
    cy.mount(
      <Badge variant="live" liveDot>
        ONLINE
      </Badge>
    );
    cy.get('[data-testid="badge"]').should('have.class', 'badge-live');
    cy.get('.status-dot-live').should('exist');
  });
});
