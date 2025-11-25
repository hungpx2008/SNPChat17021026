import { z } from 'zod';
export declare const tableActionKeys: z.ZodEnum<["addRecord", "setRecord", "deleteRecord", "addField", "setField", "deleteField", "taskProcessing", "taskCompleted", "taskCancelled"]>;
export declare const viewActionKeys: z.ZodEnum<["applyViewFilter", "applyViewGroup", "applyViewStatisticFunc", "showViewField"]>;
export declare const actionTriggerBufferSchema: z.ZodEnum<["addRecord", "setRecord", "deleteRecord", "addField", "setField", "deleteField", "taskProcessing", "taskCompleted", "taskCancelled"]>;
export type ITableActionKey = z.infer<typeof actionTriggerBufferSchema>;
export type IViewActionKey = z.infer<typeof viewActionKeys>;
