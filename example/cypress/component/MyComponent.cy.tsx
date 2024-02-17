import { h } from '@stencil/core';

describe('Mount with JSX', () => {
  it('Should mount correctly', () => {
    cy.mount(<my-component first="John" last="Doe"></my-component>);
    cy.get('my-component').should('be.visible').should('exist');
  });

  it('Should set component properties correctly', () => {
    cy.mount(<my-component first="John" last="Doe"></my-component>);
    cy.get('my-component').invoke('prop', 'first').should('eq', 'John');
    cy.get('my-component').invoke('prop', 'last').should('eq', 'Doe');
  });

  it('Should set complex component properties correctly', () => {
    cy.mount(<my-component first="John" last="Doe" complexProp={{ value: ['this', 'is', 'the', 'value'], isValid: true, error: false, message: 'The Message!' }}></my-component>);
    cy.get('my-component').invoke('prop', 'first').should('eq', 'John');
    cy.get('my-component').invoke('prop', 'last').should('eq', 'Doe');

    cy.get('my-component').shadow().find('pre').should('contain.text', `{"value":["this","is","the","value"],"isValid":true,"error":false,"message":"The Message!"}`);
  });

  it('Should set component attributes correctly', () => {
    cy.mount(<my-component attr-first="John" attr-last="Doe"></my-component>);
    cy.get('my-component').invoke('attr', 'first').should('eq', 'John');
    cy.get('my-component').invoke('attr', 'last').should('eq', 'Doe');
  });

  it('Should render multiple components via array', () => {
    cy.mount([<my-component first="firstFirst" last="firstLast"></my-component>, <my-component first="secondFirst" last="secondLast"></my-component>]);
    cy.get('my-component').should('have.length', 2);

    cy.get('my-component').first().invoke('prop', 'first').should('eq', 'firstFirst');
    cy.get('my-component').first().invoke('prop', 'last').should('eq', 'firstLast');

    cy.get('my-component').last().invoke('prop', 'first').should('eq', 'secondFirst');
    cy.get('my-component').last().invoke('prop', 'last').should('eq', 'secondLast');
  });

  it('Should mount any html element', () => {
    cy.mount(<p>This is a paragraph element!</p>);
    cy.get('p').should('have.text', 'This is a paragraph element!');
  });

  it('Should capture events', () => {
    const spyObj = { foo(e) {} };
    cy.spy(spyObj, 'foo').as('customEventSpy');
    cy.mount(<my-component onCustomEvent={spyObj.foo} first="Test" last="Event" />);
    cy.get('my-component').shadow().find('div').click();

    cy.get('@customEventSpy').should('be.calledOnceWith');
  });

  it('Should support refs', () => {
    cy.mount(<my-component ref={ref => cy.get(ref as any).as('ref')} first="Test" last="Event" />);
    cy.get('@ref').should('be.visible').should('exist');
  });

  it('Should support inline styling', () => {
    cy.mount(<my-component first="John" last="Doe" style={{ backgroundColor: 'red', width: '300px', height: '300px' }} />);
    cy.get('my-component').should('have.css', 'background-color', 'rgb(255, 0, 0)').should('have.css', 'width', '300px').should('have.css', 'height', '300px');
  });
});

describe('Mount with string', () => {
  it('Should mount correctly', () => {
    cy.mount(`<my-component first="John" last="Doe"></my-component>`);
    cy.get('my-component').should('be.visible').should('exist');
  });

  it('Should set component attributes correctly', () => {
    cy.mount(`<my-component first="John" last="Doe"></my-component>`);
    cy.get('my-component').invoke('attr', 'first').should('eq', 'John');
    cy.get('my-component').invoke('attr', 'last').should('eq', 'Doe');
  });

  it('Should mount any html element with a string', () => {
    cy.mount(`<p>This is a paragraph element!</p>`);
    cy.get('p').should('have.text', 'This is a paragraph element!');
  });
});
