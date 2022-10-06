// @ts-check

/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
	root: true,
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"],
	},
	plugins: ["react", "react-hooks", "@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended", // disable core eslint rules that conflict with replacement @typescript-eslint rules
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"prettier", // config-prettier disables eslint rules that conflict with prettier
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"react/prop-types": "off",
	},
};

module.exports = eslintConfig;
