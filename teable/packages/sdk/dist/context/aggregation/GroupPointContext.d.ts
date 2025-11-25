import React from 'react';
export declare const GroupPointContext: React.Context<({
    type: import("@teable/openapi").GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
} | {
    type: import("@teable/openapi").GroupPointType.Row;
    count: number;
})[] | null>;
