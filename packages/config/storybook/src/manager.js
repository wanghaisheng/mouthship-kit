"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAddons = void 0;
var react_1 = require("react");
var manager_api_1 = require("@storybook/manager-api");
var theme_1 = require("./theme");
manager_api_1.addons.setConfig({
    theme: theme_1.default,
});
var ExampleToolbar = function () {
    var globals = (0, manager_api_1.useGlobals)()[0];
    (0, react_1.useEffect)(function () {
        var elements = document.querySelectorAll('.docs-story');
        elements.forEach(function (element) {
            element.classList.add(globals['theme']);
        });
    }, [globals]);
    return null;
};
var registerAddons = function () {
    manager_api_1.addons.register('docs-theme', function () {
        manager_api_1.addons.add('docs-theme-addon', {
            title: 'Addon to change docs story theme',
            type: manager_api_1.types.TOOL,
            match: function (_a) {
                var viewMode = _a.viewMode;
                return !!(viewMode === null || viewMode === void 0 ? void 0 : viewMode.match(/^(?:story|docs)$/));
            },
            render: ExampleToolbar,
        });
    });
};
exports.registerAddons = registerAddons;
