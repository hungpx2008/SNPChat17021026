import { type SelectedMemberWithData } from './types';
interface SelectedMembersProps {
    selectedMembers: SelectedMemberWithData[];
    onRemove: (id: string) => void;
}
export declare function MemberSelected({ selectedMembers, onRemove }: SelectedMembersProps): import("react/jsx-runtime").JSX.Element;
export {};
