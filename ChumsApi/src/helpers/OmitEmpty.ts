// Based on https://www.npmjs.com/package/omit-empty
// The project appears to be abandoned, but needed modification to allow for empty arrays.

'use strict';

import typeOf from 'kind-of';


export class OmitEmpty {
    public static omitEmpty(obj: any, options = {}) {
        const runtimeOpts = OmitEmpty._buildRuntimeOpts(options);

        const omit = (value: any, opts: any) => {
            if (Array.isArray(value)) {
                value = value.map(v => omit(v, opts)).filter(v => !OmitEmpty.isEmpty(v, opts));
            }

            if (typeOf(value) === 'object') {
                const result: any = {};
                for (const key of Object.keys(value)) {
                    if (!opts.excludedProperties.includes(key)) {
                        const val: any = omit(value[key], opts);
                        if (val !== void 0) {
                            result[key] = val;
                        }
                    }
                }
                value = result;
            }

            if (!OmitEmpty.isEmpty(value, opts)) {
                return value;
            }
        };

        const res = omit(obj, runtimeOpts);
        if (res === void 0) {
            return typeOf(obj) === 'object' ? {} : res;
        }
        return res;
    }


    private static _buildRuntimeOpts(options: any = {}) {
        return {
            omitZero: options.omitZero || false,
            omitEmptyArray: options.omitEmptyArray || false,
            excludedProperties: options.excludedProperties || []
        };
    };

    private static isEmpty(value: any, runtimeOpts: any) {
        switch (typeOf(value)) {
            case 'null':
            case 'undefined':
                return true;
            case 'boolean':
            case 'function':
            case 'date':
            case 'regexp':
                return false;
            case 'string':
            case 'arguments':
                return value.length === 0;
            case 'file':
            case 'map':
            case 'set':
                return value.size === 0;
            case 'number':
                return runtimeOpts.omitZero ? value === 0 : false;
            case 'error':
                return value.message === '';
            case 'array':
                if (runtimeOpts.omitEmptyArray) {
                    for (const ele of value) {
                        if (!OmitEmpty.isEmpty(ele, runtimeOpts)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            case 'object':
                for (const key of Object.keys(value)) {
                    if (!OmitEmpty.isEmpty(value[key], runtimeOpts)) {
                        return false;
                    }
                }
                return true;
            default: {
                return true;
            }
        }
    }

}