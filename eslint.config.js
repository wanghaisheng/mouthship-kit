import { configs, defineConfig } from '@mouthshipkit/eslint'

export default defineConfig(
  {
    ignores: ['apps', 'packages'],
  },

  ...configs.base,
)
