import { BaseQueryColumnType } from '@teable/openapi';
export declare const useQueryContext: (tableIds: string[]) => {
    name: string;
    type: BaseQueryColumnType;
    column: string;
    fieldSource?: {
        id: string;
        name: string;
        dbFieldName: string;
        type: import("@teable/core").FieldType;
        options: {} | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
            filter?: import("@teable/core").IFilterSet | null | undefined;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            baseId?: string | undefined;
            foreignTableId?: string | undefined;
            lookupFieldId?: string | undefined;
            limit?: number | undefined;
        } | {
            expression: string;
            timeZone?: string | undefined;
            formatting?: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            } | {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            } | undefined;
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            isOneWay?: boolean | undefined;
            symmetricFieldId?: string | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
            defaultValue?: "now" | undefined;
        } | {
            defaultValue?: boolean | undefined;
        } | {
            showAs?: {
                type: import("@teable/core").SingleLineTextDisplayType;
            } | undefined;
            defaultValue?: string | undefined;
        } | {
            max: number;
            color: import("@teable/core").Colors.RedBright | import("@teable/core").Colors.TealBright | import("@teable/core").Colors.YellowBright;
            icon: import("@teable/core").RatingIcon;
        } | {
            isMultiple?: boolean | undefined;
            defaultValue?: string | string[] | undefined;
            shouldNotify?: boolean | undefined;
        } | {
            color: import("@teable/core").Colors;
            label: string;
            maxCount?: number | undefined;
            resetCount?: boolean | undefined;
            workflow?: {
                id?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
            } | null | undefined;
        } | {
            choices: {
                id: string;
                name: string;
                color: string;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
            formatting: {
                type: import("@teable/core").NumberFormattingType.Decimal;
                precision: number;
            } | {
                type: import("@teable/core").NumberFormattingType.Percent;
                precision: number;
            } | {
                symbol: string;
                type: import("@teable/core").NumberFormattingType.Currency;
                precision: number;
            };
            showAs?: {
                type: import("@teable/core").SingleNumberDisplayType;
                color: import("@teable/core").Colors;
                showValue: boolean;
                maxValue: number;
            } | {
                type: import("@teable/core").MultiNumberDisplayType;
                color: import("@teable/core").Colors;
            } | undefined;
            defaultValue?: number | undefined;
        } | {
            expression: "AUTO_NUMBER()";
        } | {
            expression: "CREATED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            expression: "LAST_MODIFIED_TIME()";
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        };
        cellValueType: import("@teable/core").CellValueType;
        dbFieldType: import("@teable/core").DbFieldType;
        description?: string | undefined;
        isMultipleCellValue?: boolean | undefined;
        meta?: {
            persistedAsGeneratedColumn: boolean;
        } | {
            hasOrderColumn: boolean;
        } | undefined;
        aiConfig?: {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Summary;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Translation;
            modelKey: string;
            sourceFieldId: string;
            targetLanguage: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Improvement;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Classification;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Tag;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            onlyAllowConfiguredOptions?: boolean | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.ImageGeneration;
            modelKey: string;
            sourceFieldId: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            n?: number | undefined;
            size?: string | undefined;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
            quality?: import("@teable/core").ImageQuality | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Rating;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Extraction;
            modelKey: string;
            sourceFieldId: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
        } | {
            type: import("@teable/core").FieldAIActionType.Customization;
            modelKey: string;
            prompt: string;
            isAutoFill?: boolean | null | undefined;
            attachPrompt?: string | undefined;
            attachmentFieldIds?: string[] | undefined;
        } | null | undefined;
        isLookup?: boolean | undefined;
        isConditionalLookup?: boolean | undefined;
        lookupOptions?: {
            foreignTableId: string;
            lookupFieldId: string;
            relationship: import("@teable/core").Relationship;
            fkHostTableName: string;
            selfKeyName: string;
            foreignKeyName: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
        } | {
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
        isPrimary?: boolean | undefined;
        isComputed?: boolean | undefined;
        isPending?: boolean | undefined;
        hasError?: boolean | undefined;
        recordRead?: boolean | undefined;
        recordCreate?: boolean | undefined;
    } | undefined;
}[];
