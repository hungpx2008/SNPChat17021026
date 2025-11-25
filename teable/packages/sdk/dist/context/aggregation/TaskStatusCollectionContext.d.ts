import React from 'react';
export declare const TaskStatusCollectionContext: React.Context<{
    cells: {
        recordId: string;
        fieldId: string;
    }[];
    fieldMap: Record<string, {
        taskId: string;
        completedCount: number;
        totalCount: number;
    }>;
} | null>;
