export type IUseFieldPermissionAction = keyof ReturnType<typeof useFieldPermission>;
export declare const useFieldPermission: () => Partial<Record<"field|create" | "field|delete" | "field|read" | "field|update", boolean>>;
