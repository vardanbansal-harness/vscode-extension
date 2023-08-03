"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = exports.memoizedParse = exports.yamlParse = exports.yamlStringify = void 0;
// eslint-disable-next-line no-restricted-imports
const js_yaml_1 = require("js-yaml");
const lodash_1 = require("lodash");
const yamlStringify = (obj, options = {}) => {
    return (0, js_yaml_1.dump)(obj, Object.assign({ noRefs: true, lineWidth: -1, quotingType: '"' }, options));
};
exports.yamlStringify = yamlStringify;
function yamlParse(input) {
    return (0, js_yaml_1.load)(input);
}
exports.yamlParse = yamlParse;
exports.memoizedParse = (0, lodash_1.memoize)(yamlParse);
/* re-export to maintain API with yaml package */
exports.parse = yamlParse;
exports.stringify = exports.yamlStringify;
//# sourceMappingURL=YAMLHelper.js.map