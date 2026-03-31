import type { Config } from 'tailwindcss'

import { withUt } from 'uploadthing/tw'

import { mouthshipkitTailwindPreset } from '@mouthshipkit/tailwind'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/dist/**/*.js'],
  darkMode: 'class',
  presets: [mouthshipkitTailwindPreset],
}

export default withUt(config)
