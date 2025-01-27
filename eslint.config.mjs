import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['node_modules', 'dist'],
        rules: {
            'no-unused-vars': 'error',
            'no-console': 'warn',
            'no-unused-expressions': 'error',
            'prefer-const': 'error',
            'no-undef': 'error',
            '@typescript-eslint/no-unused-vars': 0,
        },
    },
];
