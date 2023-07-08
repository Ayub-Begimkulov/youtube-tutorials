module.exports = {
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "custom-rules"],
  root: true,
  rules: {
    "custom-rules/strict-enum": "error",
  },
  ignorePatterns: [
    "node_modules",
    "eslint-plugin-custom-rules",
    ".eslintrc.js",
  ],
};
