import React from 'react';
import { Button } from './Button';

describe('<Button /> Component Unit Tests', () => {
  it('renders with children text and default primary variant', () => {
    cy.mount(<Button>Відкрити каталог</Button>);
    cy.get('[data-testid="button"]')
      .should('be.visible')
      .and('contain.text', 'Відкрити каталог')
      .and('have.class', 'btn-primary');
  });

  it('renders different variants and handles click events', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(
      <Button variant="danger" size="lg" onClick={onClickSpy}>
        Видалити
      </Button>
    );

    cy.get('[data-testid="button"]')
      .should('have.class', 'btn-danger')
      .and('have.class', 'btn-lg')
      .click();

    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('disables interaction when disabled prop is set', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(
      <Button disabled onClick={onClickSpy}>
        Заблоковано
      </Button>
    );

    cy.get('[data-testid="button"]').should('be.disabled');
  });
});
