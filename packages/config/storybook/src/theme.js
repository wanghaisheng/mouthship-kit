"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("@radix-ui/colors");
var theming_1 = require("@storybook/theming");
exports.default = (0, theming_1.create)({
    base: 'dark',
    fontBase: 'var(--font-geist-sans)',
    fontCode: 'var(--font-geist-mono)',
    appContentBg: colors_1.grayDark.gray1,
    appBg: colors_1.grayDark.gray1,
    barBg: colors_1.grayDark.gray1,
    inputBg: colors_1.grayDark.gray3,
    buttonBg: colors_1.grayDark.gray3,
    booleanBg: colors_1.grayDark.gray3,
    appBorderColor: colors_1.grayDark.gray2,
    appBorderRadius: 6,
    inputBorderRadius: 6,
    inputBorder: colors_1.grayDark.gray6,
    buttonBorder: colors_1.grayDark.gray6,
    textColor: colors_1.grayDark.gray11,
    colorSecondary: colors_1.blueDark.blue9,
    colorPrimary: colors_1.blueDark.blue9,
    barTextColor: colors_1.grayDark.gray11,
    barHoverColor: colors_1.blueDark.blue9,
    barSelectedColor: colors_1.blueDark.blue9,
    inputTextColor: colors_1.grayDark.gray11,
    textMutedColor: colors_1.grayDark.gray10,
    textInverseColor: colors_1.grayDark.gray1,
});
