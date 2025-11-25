interface ILinkCardProps {
    title?: string;
    readonly?: boolean;
    className?: string;
    wrapClassName?: string;
    onClick?: () => void;
    onDelete?: () => void;
}
export declare const LinkCard: (props: ILinkCardProps) => import("react/jsx-runtime").JSX.Element;
export {};
