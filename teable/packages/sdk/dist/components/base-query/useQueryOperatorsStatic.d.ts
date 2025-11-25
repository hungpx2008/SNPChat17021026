export declare const useQueryOperatorsStatic: () => ({
    readonly key: "select";
    readonly label: string;
} | {
    readonly key: "aggregation";
    readonly label: string;
} | {
    readonly key: "where";
    readonly label: string;
} | {
    readonly key: "orderBy";
    readonly label: string;
} | {
    readonly key: "groupBy";
    readonly label: string;
} | {
    readonly key: "limit";
    readonly label: string;
} | {
    readonly key: "offset";
    readonly label: string;
} | {
    readonly key: "join";
    readonly label: string;
})[];
