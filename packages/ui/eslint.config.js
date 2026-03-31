import { configs, defineConfig } from '@mouthshipkit/eslint'

export default defineConfig(
  ...configs.base,
  ...configs.react,
  ...configs.storybook,
)
