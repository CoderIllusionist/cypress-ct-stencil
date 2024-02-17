import { mount } from 'cypress-ct-stencil';
import { defineCustomElements } from '../../loader';

Cypress.Commands.add('mount', mount);

defineCustomElements();
