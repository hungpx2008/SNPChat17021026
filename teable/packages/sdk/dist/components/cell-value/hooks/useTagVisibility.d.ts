/// <reference types="react" />
export declare const useTagsVisibility: <T extends string | {
    id: string;
    title?: string | undefined;
}>(tags: T[] | undefined, maxWidth?: number, className?: string) => {
    visibleTags: T[];
    hiddenTags: T[];
    containerRef: import("react").RefObject<HTMLDivElement>;
};
