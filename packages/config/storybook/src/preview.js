"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var addon_themes_1 = require("@storybook/addon-themes");
var addon_viewport_1 = require("@storybook/addon-viewport");
var theme_1 = require("./theme");
var customViewports = {
    '720p': {
        name: '720p',
        styles: {
            width: '1280px',
            height: '720px',
        },
    },
    '1080p': {
        name: '1080p',
        styles: {
            width: '1920px',
            height: '1080px',
        },
    },
    '2k': {
        name: '2K',
        styles: {
            width: '2560px',
            height: '1440px',
        },
    },
    '4k': {
        name: '4K',
        styles: {
            width: '3840px',
            height: '2160px',
        },
    },
    '21/9': {
        name: '21/9',
        styles: {
            width: '2560px',
            height: '1080px',
        },
    },
};
var preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        viewport: {
            viewports: __assign(__assign({}, customViewports), addon_viewport_1.INITIAL_VIEWPORTS),
        },
        docs: {
            theme: theme_1.default,
        },
    },
    decorators: [
        (0, addon_themes_1.withThemeByClassName)({
            themes: {
                light: 'light',
                dark: 'dark',
            },
            defaultTheme: 'dark',
        }),
    ],
};
exports.default = preview;
