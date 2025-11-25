import type { Action } from '@teable/core';
import { ActionPrefix } from '@teable/core';
export declare const usePermissionActionsStatic: () => {
    actionStaticMap: Record<Action, {
        description: string;
    }>;
    actionPrefixStaticMap: Record<ActionPrefix, {
        title: string;
    }>;
    actionPrefixDisplayOrder: readonly ActionPrefix[];
};
