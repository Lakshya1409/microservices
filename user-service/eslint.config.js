// ESLint v9+ Flat Config for TypeScript + Prettier
// See: https://eslint.org/docs/latest/use/configure/configuration-files-new

import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig} */
export default [
  {
    files: ["**/*.ts"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2021,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          trailingComma: "es5",
          semi: true,
          singleQuote: false,
        },
      ],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
