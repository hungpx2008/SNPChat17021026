declare namespace _exports {
    export { HarParameterObject };
}
declare namespace _exports {
    export { openApiToHarList as getAll };
    export { createHar as getEndpoint };
    export { createHarParameterObjects };
}
export = _exports;
/**
 * - An object that describes a parameter in a HAR
 */
type HarParameterObject = {
    /**
     * - The name of the parameter
     */
    name: string;
    /**
     * - The value of the parameter
     */
    value: string;
};
/**
 * Produces array of HAR files for given OpenAPI document
 *
 * @param  {object}   openApi          OpenAPI document
 * @param  {Function} callback
 */
declare function openApiToHarList(openApi: object): {
    method: string;
    url: string;
    description: any;
    hars: array;
}[] | undefined;
/**
 * Create HAR Request object for path and method pair described in given OpenAPI
 * document.
 *
 * @param  {Object} openApi           OpenAPI document
 * @param  {string} path              Key of the path
 * @param  {string} method            Key of the method
 * @param  {Object} queryParamValues  Optional: Values for the query parameters if present
 * @return {array}                    List of HAR Request objects for the endpoint
 */
declare function createHar(openApi: Object, path: string, method: string, queryParamValues: Object): array;
/**
 * @typedef {object} HarParameterObject - An object that describes a parameter in a HAR
 * @property {string} name - The name of the parameter
 * @property {string} value - The value of the parameter
 */
/**
 * Returns an array of HAR parameter objects for the specified parameter and value.
 *
 * While it is quite often that a singleton array is returned, when `explode` is
 * true multiple objects may be returned.
 *
 * See https://swagger.io/docs/specification/serialization for the logic of how value of
 * the return objects are calculated
 *
 * @param {Object} parameter  - An OpenAPI Parameter object
 * @param {string} name       - The name of the parameter
 * @param {string} in         - One of the values: `path`, `query`, `header`, `cookie`
 * @param {string} [style]    - Optional: One of the OpenAPI styles {e.g. form, simple, label, matrix, ...}
 * @param {boolean} [explode] - Optional: Whether or not arrays and objects should be exploded
 * @param {*}      value      - The value to use in the query string object. Since `parameter`
 *                              has many properties that could be a candidate for the value this
 *                              parameter is used to explicitly state which value should be used.
 * @return {HarParameterObject[]} - An array of query string objects
 */
declare function createHarParameterObjects({ name, in: location, style, explode }: Object, value: any): HarParameterObject[];
