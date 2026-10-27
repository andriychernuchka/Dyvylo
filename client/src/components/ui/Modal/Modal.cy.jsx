import React from 'react';
import { Modal } from './Modal';

describe('<Modal /> Component Unit Tests', () => {
  it('does not render when isOpen is false', () => {
    cy.mount(
      <Modal isOpen={false} onClose={() => {}} title="Тестове вікно">
        <p>Контент</p>
      </Modal>
    );
    cy.get('[data-testid="modal-container"]').should('not.exist');
  });

  it('renders correctly when open and triggers onClose on close button click', () => {
    const onCloseSpy = cy.spy().as('onCloseSpy');
    cy.mount(
      <Modal isOpen={true} onClose={onCloseSpy} title="Вузол авторизації">
        <p>Будь ласка, введіть ваші облікові дані.</p>
      </Modal>
    );

    cy.get('[data-testid="modal-container"]').should('be.visible');
    cy.contains('Вузол авторизації').should('exist');
    cy.contains('Будь ласка, введіть ваші облікові дані.').should('exist');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('@onCloseSpy').should('have.been.calledOnce');
  });
});
