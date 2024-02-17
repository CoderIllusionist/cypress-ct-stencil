# Cypress Component Testing for Stencil

> Cypress component testing which leverages Stencil's JSX ⚡

## Getting started

1.  Install this package by running the following in your Stencil project;

    -   `npm install -D cypress-ct-stencil vite@4.5.2`

2.  If not installed, install cypress:

    -   `npm install -D cypress`

3.  Open Cypress:

    -   `npx cypress open`

    -   Select "Component Testing" and follow the onscreen instructions.

4.  Add `cypress-ct-stencil` to your `cypress.config.ts`;

    ```
    import { defineConfig } from 'cypress';
    import { defineConfig as defineConfigVite } from 'vite';

    ...
        devServer: {
          framework: 'cypress-ct-stencil-js' as any,
          bundler: 'vite',
          viteConfig: defineConfigVite({
            optimizeDeps: {
              exclude: ['./']
            }
          }),
        },
    ...

    ```

5.  Go to your `component.ts` file, usually located in `cypress/support` and add the following:

    ```
    import { mount } from 'cypress-ct-stencil'
    import { defineCustomElements } from '../../loader';
    Cypress.Commands.add('mount', mount);
    defineCustomElements();
    // Optional, only add if you have global styling
    // import '../../dist/project-name/project-name.css
    ```

6.  At the root of your `cypress` folder, add a `tsconfig.json` and add the following:

    ```
    {
        "extends": "../node_modules/cypress-ct-stencil/tsconfig.cypress.json"
    }
    ```

## Usage

### Typings

Since we installed Cypress in our Stencil directory, all typings are available in our `.cy.tsx` files:
![Typings image](https://github.com/CoderIllusionist/cypress-ct-stencil/blob/main/assets/image.gif?raw=true 'Typings')

### Example usages

```tsx
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should mount correctly', () => {
    cy.mount(<my-component first="John" last="Doe"></my-component>);
    cy.get('my-component').should('be.visible').should('exist');
});
```

#### Styles

```tsx
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should support inline styling', () => {
    cy.mount(<my-component first="John" last="Doe" style={{ backgroundColor: 'red', width: '300px', height: '300px' }} />);
    cy.get('my-component').should('have.css', 'background-color', 'rgb(255, 0, 0)').should('have.css', 'width', '300px').should('have.css', 'height', '300px');
});
```

#### Ref

```tsx
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should support refs', () => {
    cy.mount(<my-component ref={(ref) => cy.get(ref as any).as('ref')} first="Test" last="Event" />);
    cy.get('@ref').should('be.visible').should('exist');
});
```

#### Events

```tsx
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should capture events', () => {
    const spyObj = { foo(e) {} };
    cy.spy(spyObj, 'foo').as('customEventSpy');
    cy.mount(<my-component onCustomEvent={spyObj.foo} first="Test" last="Event" />);
    cy.get('my-component').shadow().find('div').click();

    cy.get('@customEventSpy').should('be.calledOnceWith');
});
```

#### Array

```tsx
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should render multiple components via array', () => {
    cy.mount([<my-component first="firstFirst" last="firstLast"></my-component>, <my-component first="secondFirst" last="secondLast"></my-component>]);
    cy.get('my-component').should('have.length', 2);

    cy.get('my-component').first().invoke('prop', 'first').should('eq', 'firstFirst');
    cy.get('my-component').first().invoke('prop', 'last').should('eq', 'firstLast');

    cy.get('my-component').last().invoke('prop', 'first').should('eq', 'secondFirst');
    cy.get('my-component').last().invoke('prop', 'last').should('eq', 'secondLast');
});
```

#### Other elements:

```tsx
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should mount any html element', () => {
    cy.mount(<p>This is a paragraph element!</p>);
    cy.get('p').should('have.text', 'This is a paragraph element!');
});
```

#### String (not recommended as you lose typings)

```ts
// MyComponent.cy.tsx
import { h } from '@stencil/core';

it('Should mount any html element with a string', () => {
    cy.mount(`<p>This is a paragraph element!</p>`);
    cy.get('p').should('have.text', 'This is a paragraph element!');
});
```

## Example

Example with Stencil and Cypress is located in the `example` directory of this repo.
