import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginStorybook from "eslint-plugin-storybook"
// import pluginReactHooks from "eslint-plugin-react-hooks"


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["src/**/*.{ts,tsx}"]},
  {ignores: ['dist/**']},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  // pluginReactHooks.configs['recommended-latest']
  ...pluginStorybook.configs['flat/recommended'],
 
];