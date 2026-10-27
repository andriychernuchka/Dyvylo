import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('<Card /> Component Unit Tests', () => {
  it('renders card with header, body and footer', () => {
    cy.mount(
      <Card hoverable bordered>
        <CardHeader>Вузол #KYIV-01</CardHeader>
        <CardBody>
          <p>Статус трансляції: Активний</p>
        </CardBody>
        <CardFooter>
          <span>Затримка: 12ms</span>
        </CardFooter>
      </Card>
    );

    cy.get('[data-testid="card"]')
      .should('be.visible')
      .and('have.class', 'card-hoverable')
      .and('have.class', 'card-bordered');

    cy.contains('Вузол #KYIV-01').should('exist');
    cy.contains('Статус трансляції: Активний').should('exist');
    cy.contains('Затримка: 12ms').should('exist');
  });

  it('triggers onClick handler when clicked', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(
      <Card onClick={onClickSpy}>
        <CardBody>Клікабельна картка</CardBody>
      </Card>
    );

    cy.get('[data-testid="card"]').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });
});
