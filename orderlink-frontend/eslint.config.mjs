// Basic ESLint configuration for JavaScript files only
export default {
  root: true,
  extends: ["eslint:recommended"],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn"
  },
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "public/**",
    "**/*.ts",
    "**/*.tsx"
  ]
};
