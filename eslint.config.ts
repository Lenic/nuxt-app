// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt(
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  eslintConfigPrettier,
);
