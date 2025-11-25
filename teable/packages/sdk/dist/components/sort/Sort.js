import { jsx as _jsx } from "react/jsx-runtime";
import { useMutation } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { useView } from '../../hooks';
import { SortBase } from './SortBase';
import { useSortNode } from './useSortNode';
function Sort(props) {
    const { children, onChange, sorts: outerSorts } = props;
    const sortBaseRef = useRef(null);
    const view = useView();
    const [innerSorts, setInnerSorts] = useState(outerSorts);
    const { text, isActive } = useSortNode(outerSorts);
    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async ({ view, viewRo }) => {
            return (await view.manualSort(viewRo)).data;
        },
        onSuccess: () => {
            sortBaseRef.current?.close();
        },
    });
    useEffect(() => {
        // async from sharedb
        setInnerSorts(outerSorts);
    }, [outerSorts]);
    useDebounce(() => {
        /**
         * there only following scenarios to update
         * 1. only switch the manualSort
         * 2. only manualSort is true
         */
        if (isEqual(innerSorts, outerSorts)) {
            return;
        }
        const onlyAutoSortChange = isEqual(outerSorts?.sortObjs, innerSorts?.sortObjs) &&
            outerSorts?.manualSort !== innerSorts?.manualSort;
        if (onlyAutoSortChange) {
            onChange(innerSorts);
            return;
        }
        if (!innerSorts && outerSorts?.manualSort) {
            onChange(innerSorts);
            return;
        }
        !innerSorts?.manualSort && onChange(innerSorts);
    }, 50, [innerSorts]);
    const manualSort = async () => {
        if (innerSorts?.sortObjs?.length) {
            const viewRo = {
                sortObjs: innerSorts.sortObjs,
            };
            view && mutateAsync({ view, viewRo });
        }
    };
    const onChangeInner = (sorts) => {
        if (sorts == null)
            return setInnerSorts(null);
        if (!Object.hasOwnProperty.call(sorts, 'manualSort')) {
            setInnerSorts({
                sortObjs: sorts?.sortObjs || [],
                manualSort: outerSorts?.manualSort,
            });
            return;
        }
        setInnerSorts(sorts);
    };
    return (_jsx(SortBase, { ref: sortBaseRef, sorts: innerSorts, manualSortLoading: isLoading, onChange: onChangeInner, manualSortOnClick: manualSort, children: children?.(text, isActive) }));
}
export { Sort };
