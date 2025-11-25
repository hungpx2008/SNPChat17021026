import type { OpenAPIObject } from 'openapi3-ts/oas30';
export declare function getOpenApiDocumentation(config: {
    origin?: string;
    snippet?: boolean;
    tags?: string[];
    paths?: string[];
    methods?: string[];
}): Promise<OpenAPIObject>;
