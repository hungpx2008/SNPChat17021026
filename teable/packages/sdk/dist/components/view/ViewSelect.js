import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { getViewList } from '@teable/openapi';
import { cn } from '@teable/ui-lib';
import { ReactQueryKeys } from '../../config';
import { BaseSingleSelect } from '../filter/view-filter/component';
import { VIEW_ICON_MAP } from './constant';
export const ViewSelect = (props) => {
    const { value = null, onChange, tableId, className, typeFilter, cancelable = false } = props;
    const { data: viewRawData } = useQuery({
        queryKey: ReactQueryKeys.viewList(tableId),
        queryFn: () => getViewList(tableId).then((res) => res.data),
        enabled: !!tableId,
    });
    const viewList = (typeFilter ? viewRawData?.filter((view) => view.type === typeFilter) : viewRawData) || [];
    const options = viewList.map(({ id, type, name }) => ({
        value: id,
        label: name,
        icon: VIEW_ICON_MAP[type],
    }));
    const displayRender = (option) => {
        const { icon: Icon, label } = option;
        return (_jsxs("div", { className: "flex items-center justify-start", children: [_jsx("div", { className: "shrink-0", children: Icon && _jsx(Icon, { className: "size-4" }) }), _jsx("div", { className: "truncate pl-2", children: label })] }));
    };
    return (_jsx(BaseSingleSelect, { options: options, value: value, onSelect: (newValue) => {
            onChange(newValue);
        }, popoverClassName: "w-[350px]", displayRender: displayRender, optionRender: displayRender, cancelable: cancelable, className: cn('my-1 h-9', className), modal: true }));
};
