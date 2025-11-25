import type { IFieldRo, IConvertFieldRo, NotificationStatesEnum, IGetFieldsQuery } from '@teable/core';
import type { IListBaseCollaboratorUserRo, IShareViewRowCountRo, IShareViewAggregationsRo, IAggregationRo, IGroupPointsRo, IQueryBaseRo, ResourceType, ListSpaceCollaboratorRo, IGetRecordsRo, ListBaseCollaboratorRo, ICalendarDailyCollectionRo, IGetDepartmentListRo, IGetDepartmentUserRo, IShareViewCollaboratorsRo, ICreateRecordsRo, IUpdateRecordRo, IUpdateRecordsRo, IRecordInsertOrderRo, IUpdateRecordOrdersRo } from '@teable/openapi';
export declare const ReactQueryKeys: {
    space: (spaceId: string) => readonly ["space", string];
    base: (baseId: string) => readonly ["base", string];
    baseAll: () => readonly ["base-all"];
    templateList: () => readonly ["template-list"];
    templateCategoryList: () => readonly ["template-category-list"];
    templateDetail: (templateId: string) => readonly ["template-detail", string];
    publishedTemplateCategoryList: () => readonly ["published-template-category-list"];
    publishedTemplateList: () => readonly ["published-template-list"];
    baseList: (spaceId: string) => readonly ["base-list", string];
    pinList: () => readonly ["pin-list"];
    spaceList: () => readonly ["space-list"];
    tableList: (baseId: string) => readonly ["table-list", string];
    recordCommentCount: (tableId: string, recordId: string) => readonly ["record-comment-count", string, string];
    commentList: (tableId: string, recordId: string) => readonly ["comment-list", string, string];
    commentCount: (tableId: string, query?: IGetRecordsRo) => readonly ["comment-count", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        projection?: string[] | undefined;
        cellFormat?: import("@teable/core").CellFormat | undefined;
        fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
        orderBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        collapsedGroupIds?: string[] | undefined;
        queryId?: string | undefined;
        take?: number | undefined;
        skip?: number | undefined;
    } | undefined];
    commentDetail: (tableId: string, recordId: string, commentId: string) => readonly ["comment-detail", string, string, string];
    commentAttachment: (tableId: string, recordId: string, path: string) => readonly ["comment-attachment", string, string, string];
    commentSubscribeStatus: (tableId: string, recordId: string) => readonly ["comment-notify-status", string, string];
    subscriptionSummary: (spaceId: string) => readonly ["subscription-summary", string];
    subscriptionSummaryList: () => readonly ["subscription-summary"];
    instanceUsage: () => readonly ["instance-usage"];
    spaceCollaboratorList: (spaceId: string, options?: ListSpaceCollaboratorRo) => readonly ["space-collaborator-list", string, {
        type?: import("@teable/openapi").PrincipalType | undefined;
        search?: string | undefined;
        orderBy?: "asc" | "desc" | undefined;
        take?: number | undefined;
        skip?: number | undefined;
        includeSystem?: boolean | undefined;
        includeBase?: boolean | undefined;
    }] | readonly ["space-collaborator-list", string];
    baseCollaboratorList: (baseId: string, options?: ListBaseCollaboratorRo) => readonly ["base-collaborator-list", string, {
        type?: import("@teable/openapi").PrincipalType | undefined;
        search?: string | undefined;
        take?: number | undefined;
        skip?: number | undefined;
        role?: ("editor" | "owner" | "creator" | "commenter" | "viewer")[] | undefined;
        includeSystem?: boolean | undefined;
    }] | readonly ["base-collaborator-list", string];
    baseCollaboratorListUser: (baseId: string, options?: IListBaseCollaboratorUserRo) => readonly ["base-collaborator-list-user", string, {
        search?: string | undefined;
        orderBy?: "asc" | "desc" | undefined;
        take?: number | undefined;
        skip?: number | undefined;
        includeSystem?: boolean | undefined;
    }] | readonly ["base-collaborator-list-user", string];
    notifyList: (filter: {
        status: NotificationStatesEnum;
    }) => readonly ["notification", "list", {
        status: NotificationStatesEnum;
    }];
    notifyUnreadCount: () => string[];
    rowCount: (tableId: string, query: IQueryBaseRo) => readonly ["row-count", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
    }];
    groupPoints: (tableId: string, query: IGroupPointsRo) => readonly ["group-points", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        collapsedGroupIds?: string[] | undefined;
    }];
    aggregations: (tableId: string, query: IAggregationRo) => readonly ["aggregations", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        field?: Partial<Record<import("@teable/core").StatisticsFunc, string[]>> | undefined;
    }];
    shareView: (shareId: string) => readonly ["share-view", string];
    shareViewRowCount: (shareId: string, query: IShareViewRowCountRo) => readonly ["share-view-row-count", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
    }];
    shareViewGroupPoints: (shareId: string, query: IGroupPointsRo) => readonly ["share-view-group-points", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        collapsedGroupIds?: string[] | undefined;
    }];
    shareViewAggregations: (shareId: string, query: IShareViewAggregationsRo) => readonly ["share-view-aggregations", string, {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        field?: Partial<Record<import("@teable/core").StatisticsFunc, string[]>> | undefined;
    }];
    createField: (tableId: string, fieldRo: IFieldRo) => readonly ["create-field", string, {
        type: import("@teable/core").FieldType;
        description?: string | null | undefined;
        id?: string | undefined;
        name?: string | undefined;
        dbFieldName?: string | undefined;
        options?: {} | {
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
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            foreignTableId: string;
            relationship: import("@teable/core").Relationship;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            lookupFieldId?: string | undefined;
            isOneWay?: boolean | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting?: {
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
            choices: {
                name: string;
                id?: string | undefined;
                color?: string | undefined;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
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
        } | undefined;
        order?: {
            viewId: string;
            orderIndex: number;
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
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
    }];
    deleteField: (tableId: string, fieldId: string) => readonly ["delete-field", string, string];
    convertField: (tableId: string, fieldId: string, fieldRo: IConvertFieldRo) => readonly ["convert-field", string, string, {
        type: import("@teable/core").FieldType;
        description?: string | null | undefined;
        name?: string | undefined;
        dbFieldName?: string | undefined;
        options?: {} | {
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
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            foreignTableId: string;
            relationship: import("@teable/core").Relationship;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            lookupFieldId?: string | undefined;
            isOneWay?: boolean | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting?: {
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
            choices: {
                name: string;
                id?: string | undefined;
                color?: string | undefined;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
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
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
    }];
    planFieldCreate: (tableId: string, fieldRo: IFieldRo) => readonly ["create-field-plan", string, {
        type: import("@teable/core").FieldType;
        description?: string | null | undefined;
        id?: string | undefined;
        name?: string | undefined;
        dbFieldName?: string | undefined;
        options?: {} | {
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
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            foreignTableId: string;
            relationship: import("@teable/core").Relationship;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            lookupFieldId?: string | undefined;
            isOneWay?: boolean | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting?: {
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
            choices: {
                name: string;
                id?: string | undefined;
                color?: string | undefined;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
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
        } | undefined;
        order?: {
            viewId: string;
            orderIndex: number;
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
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
    }];
    planFieldConvert: (tableId: string, fieldId: string, fieldRo: IConvertFieldRo) => readonly ["convert-field-plan", string, string, {
        type: import("@teable/core").FieldType;
        description?: string | null | undefined;
        name?: string | undefined;
        dbFieldName?: string | undefined;
        options?: {} | {
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
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            formatting: {
                date: string;
                timeZone: string;
                time: import("@teable/core").TimeFormatting;
            };
        } | {
            foreignTableId: string;
            relationship: import("@teable/core").Relationship;
            filter?: import("@teable/core").IFilterSet | null | undefined;
            baseId?: string | undefined;
            lookupFieldId?: string | undefined;
            isOneWay?: boolean | undefined;
            filterByViewId?: string | null | undefined;
            visibleFieldIds?: string[] | null | undefined;
        } | {
            formatting?: {
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
            choices: {
                name: string;
                id?: string | undefined;
                color?: string | undefined;
            }[];
            defaultValue?: string | string[] | undefined;
            preventAutoNewOptions?: boolean | undefined;
        } | {
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
            filter: import("@teable/core").IFilterSet | null;
            foreignTableId: string;
            lookupFieldId: string;
            sort?: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            } | undefined;
            baseId?: string | undefined;
            limit?: number | undefined;
        } | {
            foreignTableId: string;
            lookupFieldId: string;
            linkFieldId: string;
            filter?: import("@teable/core").IFilterSet | null | undefined;
        } | undefined;
        notNull?: boolean | undefined;
        unique?: boolean | undefined;
    }];
    planField: (tableId: string, fieldId: string) => readonly ["field-plan", string, string];
    planFieldDelete: (tableId: string, fieldId: string) => readonly ["delete-field-plan", string, string];
    createRecords: (tableId: string, recordsRo: ICreateRecordsRo) => readonly ["create-records", string, {
        records: {
            fields: Record<string, unknown>;
        }[];
        fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
        typecast?: boolean | undefined;
        order?: {
            viewId: string;
            anchorId: string;
            position: "before" | "after";
        } | undefined;
    }];
    updateRecord: (tableId: string, recordId: string, recordRo: IUpdateRecordRo) => readonly ["update-record", string, string, {
        record: {
            fields: Record<string, unknown>;
        };
        fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
        typecast?: boolean | undefined;
        order?: {
            viewId: string;
            anchorId: string;
            position: "before" | "after";
        } | undefined;
    }];
    updateRecords: (tableId: string, recordsRo: IUpdateRecordsRo) => readonly ["update-records", string, {
        records: {
            id: string;
            fields: Record<string, unknown>;
        }[];
        fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
        typecast?: boolean | undefined;
        order?: {
            viewId: string;
            anchorId: string;
            position: "before" | "after";
        } | undefined;
    }];
    duplicateRecord: (tableId: string, recordId: string, order: IRecordInsertOrderRo) => readonly ["duplicate-record", string, string, {
        viewId: string;
        anchorId: string;
        position: "before" | "after";
    }];
    updateRecordOrders: (tableId: string, viewId: string, order: IUpdateRecordOrdersRo) => readonly ["update-record-orders", string, string, {
        anchorId: string;
        position: "before" | "after";
        recordIds: string[];
    }];
    personAccessTokenList: () => string[];
    personAccessToken: (id: string) => string[];
    tableInfo: (baseId: string, tableId: string) => string[];
    field: (tableId: string) => string[];
    shareViewCollaborators: (shareId: string, query?: IShareViewCollaboratorsRo) => readonly ["share-view-collaborators", string, {
        type?: import("@teable/openapi").PrincipalType | undefined;
        search?: string | undefined;
        take?: number | undefined;
        skip?: number | undefined;
        fieldId?: string | undefined;
    }] | readonly ["share-view-collaborators", string];
    getViewFilterLinkRecords: (tableId: string, viewId: string) => readonly ["get-view-filter-link-records", string, string];
    getFieldFilterLinkRecords: (tableId: string, fieldId: string) => readonly ["get-field-filter-link-records", string, string];
    shareViewLinkRecords: (shareId: string, fieldId: string, search?: string) => readonly ["share-link-records", string, string, string | undefined];
    getTablePermission: (baseId: string, tableId: string) => readonly ["table-permission", string, string];
    getBasePermission: (baseId: string) => readonly ["base-permission", string];
    getRecordHistory: (tableId: string, recordId?: string) => readonly ["record-history", string, string | undefined];
    getSharedBase: () => readonly ["shared-base-list"];
    getSpaceTrash: (resourceType: ResourceType) => readonly ["space-trash", ResourceType];
    getTrashItems: (resourceId: string) => readonly ["trash-items", string];
    getDashboardList: (baseId: string) => readonly ["dashboard-list", string];
    getDashboard: (dashboardId: string) => readonly ["dashboard", string];
    viewList: (tableId: string) => readonly ["view-list", string];
    fieldList: (tableId: string, query?: IGetFieldsQuery) => readonly ["field-list", string, {
        viewId?: string | undefined;
        filterHidden?: boolean | undefined;
        projection?: string[] | undefined;
    } | undefined];
    calendarDailyCollection: (tableId: string, query: ICalendarDailyCollectionRo) => readonly ["calendar-daily-collection", string, {
        startDate: string;
        endDate: string;
        startDateFieldId: string;
        endDateFieldId: string;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
    }];
    getDepartmentList: (ro?: IGetDepartmentListRo) => readonly ["department-list", {
        search?: string | undefined;
        parentId?: string | undefined;
        includeChildrenDepartment?: boolean | undefined;
    } | undefined];
    getDepartmentUsers: (ro?: IGetDepartmentUserRo) => readonly ["department-users", {
        search?: string | undefined;
        take?: number | undefined;
        skip?: number | undefined;
        departmentId?: string | undefined;
        includeChildrenDepartment?: boolean | undefined;
    } | undefined];
    getOrganizationMe: () => readonly ["organization-me"];
    getIntegrationList: (spaceId: string) => readonly ["integration-list", string];
    getPluginPanelList: (tableId: string) => readonly ["plugin-list", string];
    getPluginPanel: (tableId: string, panelId: string) => readonly ["plugin", string, string];
    getPluginContextMenuPlugins: (tableId: string) => readonly ["plugin-context-menu-plugins", string];
    getPluginContextMenuPlugin: (tableId: string, pluginInstallId: string) => readonly ["plugin-context-menu-plugin", string, string];
    getPublicSetting: () => readonly ["public-setting"];
    getEnterpriseLicenseStatus: () => readonly ["enterprise-license-status"];
    userLastVisitMap: (baseId: string) => readonly ["user-last-visit-map", string];
    getTaskStatusCollection: (tableId: string) => readonly ["task-status-collection", string];
    chatHistory: (baseId: string) => readonly ["chat-history", string];
    recentlyBase: () => readonly ["recently-base"];
};
