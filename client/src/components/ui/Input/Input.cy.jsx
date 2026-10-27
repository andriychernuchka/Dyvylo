import React from 'react';
import { Input } from './Input';

describe('<Input /> Component Unit Tests', () => {
  it('renders input with label and accepts typed text', () => {
    cy.mount(
      <Input label="Пошуковий запит" placeholder="Введіть назву фільму або вузла..." />
    );

    cy.contains('Пошуковий запит').should('exist');
    cy.get('[data-testid="input-field"]')
      .should('be.visible')
      .type('Тіні забутих предків')
      .should('have.value', 'Тіні забутих предків');
  });

  it('renders validation error state', () => {
    cy.mount(<Input label="Електронна пошта" error="Некоректний формат email адреси" />);

    cy.get('.has-error').should('exist');
    cy.contains('Некоректний формат email адреси').should('exist');
  });
});
