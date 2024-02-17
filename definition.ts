import { defineComponentFramework } from 'cypress';

const stencilDep: Cypress.CypressComponentDependency = {
    type: 'stenciljs',
    name: 'Stencil',
    package: '@stencil/core',
    installer: '@',
    description: 'A Compiler for Web Components and Progressive Web Apps.',
    minVersion: '^=3.0.0',
};

/**
 * The definition.
 */
export default defineComponentFramework({
    type: 'cypress-ct-stencil',

    name: 'Stencil',

    supportedBundlers: ['vite'],

    detectors: [stencilDep],

    dependencies: () => {
        const deps = [stencilDep];
        return deps;
    },

    /**
     * An SVG icon. Shown when configuring Component Testing for the first time.
     * Optional, but good for branding your Framework Definition.
     */
    // @ts-ignore - need latest binary
    icon: `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 608.000000 460.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,460.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
    <path d="M2638 4468 c-252 -270 -1114 -1203 -1122 -1215 -6 -10 228 -13 1156 -13 l1163 1 620 671 c341 369 622 675 623 680 2 4 -518 8 -1156 8 l-1160 0 -124 -132z"/>
    <path d="M680 2349 c-322 -346 -605 -652 -628 -680 l-44 -49 2404 0 2403 0 585 631 c322 346 605 652 628 680 l44 49 -2404 0 -2403 0 -585 -631z"/>
    <path d="M1905 998 c-181 -199 -458 -501 -615 -671 -157 -170 -286 -314 -288 -318 -2 -5 513 -9 1155 -9 l1159 0 615 661 c338 363 620 669 628 680 13 19 -8 19 -1155 18 l-1169 -1 -330 -360z"/>
    </g>
    </svg>
      `,
});
