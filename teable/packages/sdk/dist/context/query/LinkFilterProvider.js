import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { LinkListType } from '../../components/editor/link/interface';
import { LinkFilterContext } from './LinkFilterContext';
export const LinkFilterProvider = (props) => {
    const [filterLinkCellCandidate, setLinkCellCandidate] = useState(props.filterLinkCellCandidate);
    const [filterLinkCellSelected, setLinkCellSelected] = useState(props.filterLinkCellSelected);
    const [selectedRecordIds, setSelectedRecordIds] = useState(props.selectedRecordIds);
    const [listType, setListType] = useState(props.listType ?? LinkListType.Unselected);
    return (_jsx(LinkFilterContext.Provider, { value: {
            selectedRecordIds,
            filterLinkCellSelected,
            filterLinkCellCandidate,
            listType,
            setSelectedRecordIds,
            setLinkCellSelected: (value) => {
                setLinkCellCandidate(undefined);
                setLinkCellSelected(Array.isArray(value)
                    ? value.length === 2
                        ? value
                        : value[0]
                    : value);
            },
            setLinkCellCandidate: (value) => {
                setLinkCellSelected(undefined);
                setLinkCellCandidate(Array.isArray(value)
                    ? value.length === 2
                        ? value
                        : value[0]
                    : value);
            },
            setListType: (value) => {
                setListType(value);
                if (value === LinkListType.Selected) {
                    setLinkCellCandidate(undefined);
                }
                else {
                    setLinkCellSelected(undefined);
                }
            },
        }, children: props.children }));
};
