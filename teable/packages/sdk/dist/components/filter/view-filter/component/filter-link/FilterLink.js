import { jsx as _jsx } from "react/jsx-runtime";
import { INPUT_OPERATORS } from './constant';
import { FilterLinkContext } from './context';
import { FilterLinkInput } from './FilterLinkInput';
import { FilterLinkSelect } from './FilterLinkSelect';
/**
 * why use props emit filter link context
 * just for reuse this component in other place, making it more flexible
 */
export const FilterLink = (props) => {
    return (_jsx(FilterLinkContext.Provider, { value: { context: props.context }, children: _jsx(FilterLinkBase, { ...props, components: {
                Input: FilterLinkInput,
                Select: FilterLinkSelect,
            } }) }));
};
export const FilterLinkBase = (props) => {
    const { components, ...rest } = props;
    const isInput = INPUT_OPERATORS.includes(props.operator);
    const InputCom = components?.Input ?? FilterLinkInput;
    const SelectCom = components?.Select ?? FilterLinkSelect;
    if (isInput) {
        return _jsx(InputCom, { ...rest, value: rest.value });
    }
    return _jsx(SelectCom, { ...rest });
};
