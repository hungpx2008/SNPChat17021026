import type { IGetDepartmentVo } from '@teable/openapi';
import React from 'react';
interface IDepartmentSelectorProps {
    title?: React.ReactNode;
    onSelect: (departmentId: string, department: IGetDepartmentVo) => void;
    children?: React.ReactNode;
    calcDisabled?: (department: IGetDepartmentVo) => {
        clickable?: boolean;
        selectable?: boolean;
    };
}
export interface IDepartmentSelectorRef {
    open: () => void;
    close: () => void;
}
export declare const DepartmentSelector: React.ForwardRefExoticComponent<IDepartmentSelectorProps & React.RefAttributes<IDepartmentSelectorRef>>;
export {};
