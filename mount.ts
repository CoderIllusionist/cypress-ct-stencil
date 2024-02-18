import { getContainerEl, setupHooks } from '@cypress/mount-utils';
import { type VNode } from '@stencil/core';

export function mount(
    template: VNode | VNode[] | string,
    options: Options = { waitUntilVisible: Cypress.env('CtStencilWaitUntilVisible'), log: Cypress.env('CtStencilLog') }
) {
    const container = getContainerEl();
    if (Array.isArray(template)) {
        template.forEach((v) => {
            const element = createDOMNode(v, options.log);
            element && container.appendChild(element);
        });
    } else if (typeof template === 'string') {
        container.innerHTML = template;
    } else {
        const element = createDOMNode(template, options.log);
        element && container.appendChild(element);
    }

    if (options.waitUntilVisible) Array.from(container.children).forEach((v) => waitUntilVisible(v));
}

function waitUntilVisible(element: Element | undefined) {
    if (!element) return;
    if ('children' in element) Array.from(element.children).forEach((v) => waitUntilVisible(v));
    cy.get(element.nodeName.toLowerCase()).should('be.visible');
}

/**
 * Function that recusively creates DOM nodes.
 * @param vnode Stencil's VNode
 */
function createDOMNode(vnode: VNode, log: boolean | undefined): Node | void {
    const { $attrs$: attrs, $tag$: tag } = vnode;
    if (!tag) return;
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
        const childNode = createDOMNode(child, log);
        if (childNode) el.appendChild(childNode);
        if (text) el.innerText = text;
    }

    if (log) Cypress.log({ name: 'Mount', message: 'Mounting node ' + el.tagName.toLowerCase() });

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
    /**
     * Waits for all children in the mount function to be visible.
     * @notice does not wait for children in `shadowRoot`.
     */
    waitUntilVisible?: boolean;
    /**
     * Logs when its about to mount a node.
     */
    log?: boolean;
}

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}
