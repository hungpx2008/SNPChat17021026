declare module '@mem0ai/mem0' {
  export class Mem0 {
    constructor(config?: Record<string, unknown>);
    search: (query: string, options?: Record<string, unknown>) => Promise<any[]>;
    add: (payload: Record<string, unknown>) => Promise<any>;
  }

  export class MemoryClient {
    constructor(config?: Record<string, unknown>);
    search: (query: string, options?: Record<string, unknown>) => Promise<any[]>;
    add: (payload: Record<string, unknown>) => Promise<any>;
  }

  const _default: typeof Mem0;
  export default _default;
}
