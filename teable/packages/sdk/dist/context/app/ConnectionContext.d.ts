import React from 'react';
import type { Connection } from 'sharedb/lib/client';
export declare const ConnectionContext: React.Context<{
    connection?: Connection | undefined;
    connected: boolean;
}>;
