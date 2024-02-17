import { getContainerEl, setupHooks } from '@cypress/mount-utils';
import { type VNode } from '@stencil/core';

export function mount(template: VNode | VNode[] | string, options: Options = { waitUntilVisible: true }) {
    const container = getContainerEl();

    if (typeof template === 'string') {
        container.innerHTML = template;
    } else if (Array.isArray(template)) {
        template.forEach((v) => {
            const element = createDOMNode(v);
            container.appendChild(element);
        });
    } else {
        const element = createDOMNode(template);
        container.appendChild(element);
        options.waitUntilVisible && cy.get(element.nodeName.toLowerCase(), { log: false }).should('be.visible').as(element.nodeName.toLowerCase());
    }

    // adds output to the command log
    if (options.log) {
        return cy.wait(0, { log: false }).then(() => {
            Cypress.log({
                name: 'mount',
                message: 'Mounted component',
            });
        });
    }
}

/**
 * Function that recusively creates DOM nodes.
 * @param vnode Stencil's VNode
 * @returns - Node
 */
function createDOMNode(vnode: VNode): Node {
    const { $attrs$: attrs, $tag$: tag } = vnode;
    const el = document.createElement(tag as string);

    for (const key in attrs) {
        if (key === 'style' && typeof attrs[key] === 'object') {
            const styleObj = attrs[key];
            // @ts-ignore
            Object.entries(styleObj).forEach((styleProp) => (el.style[styleProp[0]] = styleProp[1]));
        } else if (key.startsWith('data')) {
            el.setAttribute(key, attrs[key]);
        } else if (key.startsWith('attr-')) {
            el.setAttribute(key.split('attr-').pop() ?? '', attrs[key]);
        } else if (key === 'class') {
            el.className = attrs[key];
        } else if (typeof attrs[key] === 'function' && key !== 'ref') {
            el.addEventListener(camelize(key.substring(2)), attrs[key]);
        } else if (key === 'ref') {
            attrs[key](el);
        } else {
            // @ts-ignore
            el[key] = attrs[key];
        }
    }

    const children = vnode.$children$ || [];

    for (const child of children) {
        const text = child.$text$;
        const childNode = createDOMNode(child);
        if (childNode) el.appendChild(childNode);
        if (text) el.innerText = text;
    }

    return el;
}

function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '';
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

function cleanup() {
    getContainerEl().textContent = '';
}

setupHooks(cleanup);

interface Options {
    waitUntilVisible?: boolean;
    log?: boolean;
}

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}
