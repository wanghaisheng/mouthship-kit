"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filesystem_1 = require("@mouthshipkit/utils/filesystem");
var config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        (0, filesystem_1.getAbsolutePath)('@storybook/addon-links'),
        {
            name: (0, filesystem_1.getAbsolutePath)('@storybook/addon-essentials'),
            options: {
                backgrounds: false,
            },
        },
        (0, filesystem_1.getAbsolutePath)('@storybook/addon-onboarding'),
        (0, filesystem_1.getAbsolutePath)('@storybook/addon-interactions'),
        (0, filesystem_1.getAbsolutePath)('@storybook/addon-themes'),
        (0, filesystem_1.getAbsolutePath)('@storybook/addon-a11y'),
    ],
    framework: {
        name: (0, filesystem_1.getAbsolutePath)('@storybook/react-vite'),
        options: {
            strictMode: true,
        },
    },
    staticDirs: [(0, filesystem_1.getAbsolutePath)('@mouthshipkit/assets')],
    docs: {
        autodocs: 'tag',
    },
};
exports.default = config;
