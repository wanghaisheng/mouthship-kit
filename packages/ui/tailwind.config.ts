import type { Config } from 'tailwindcss'

import { mouthshipkitTailwindPreset } from '@mouthshipkit/tailwind'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  presets: [mouthshipkitTailwindPreset],
}

export default config
