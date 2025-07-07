import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig} */
export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
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
