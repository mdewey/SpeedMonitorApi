import globals from "globals";
import path from "node:path";
import pluginJs from "@eslint/js";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {
    languageOptions: {
      globals: {
          ...globals.browser,
          ...globals.commonjs,
          ...globals.node,
          ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
  },
  {
    rules: {
        semi: [1, "always"],

        "max-len": [1, {
            code: 90,
        }],

        "no-var": 2,
        "no-undef": 2,
        "object-curly-spacing": [1, "always"],
        "indent": ["error", 2],
        "linebreak-style": 0
    },
  },
  pluginJs.configs.recommended,
];