import { TreeNodeType } from './types';
import type { SelectedMember, TreeNode } from './types';
interface DepartmentListProps {
    departmentId?: string;
    selectedMembers: SelectedMember[];
    onSelect: (member: TreeNode) => void;
    className?: string;
    search?: string;
    excludeType?: TreeNodeType[];
    disabledDepartment?: boolean;
}
export declare function DepartmentList({ departmentId, selectedMembers, onSelect, className, search, excludeType, disabledDepartment, }: DepartmentListProps): import("react/jsx-runtime").JSX.Element;
export {};
