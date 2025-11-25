export interface ISpriteProps {
    fgColor: string;
    bgColor: string;
}
export declare const eyeOff: (props: ISpriteProps) => string;
export declare const sprites: {
    add: (props: ISpriteProps) => string;
    drag: (props: ISpriteProps) => string;
    detail: (props: ISpriteProps) => string;
    description: (props: ISpriteProps) => string;
    close: (props: ISpriteProps) => string;
    expand: (props: ISpriteProps) => string;
    collapse: (props: ISpriteProps) => string;
    lock: (props: ISpriteProps) => string;
    eyeOff: (props: ISpriteProps) => string;
};
export declare enum GridInnerIcon {
    Add = "add",
    Drag = "drag",
    Detail = "detail",
    Description = "description",
    Close = "close",
    Expand = "expand",
    Collapse = "collapse",
    Lock = "lock",
    EyeOff = "eyeOff"
}
