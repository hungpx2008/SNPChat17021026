import type { FieldType } from '../constant';
import type { IFieldVisitor } from '../field-visitor.interface';
import type { IUserCellValue } from './abstract/user.field.abstract';
import { UserAbstractCore } from './abstract/user.field.abstract';
import { type IUserFieldOptions } from './user-option.schema';
interface IUser {
    id: string;
    name: string;
    email: string;
}
interface IContext {
    userSets?: IUser[];
}
export declare const defaultUserFieldOptions: IUserFieldOptions;
export declare class UserFieldCore extends UserAbstractCore {
    type: FieldType.User;
    options: IUserFieldOptions;
    static defaultOptions(): {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    };
    get isStructuredCellValue(): boolean;
    convertStringToCellValue(value: string, ctx?: IContext): IUserCellValue | IUserCellValue[] | null;
    private matchUser;
    repair(value: unknown): unknown;
    validateOptions(): import("zod").SafeParseReturnType<{
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    }, {
        isMultiple?: boolean | undefined;
        defaultValue?: string | string[] | undefined;
        shouldNotify?: boolean | undefined;
    }>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
export {};
