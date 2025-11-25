import { jsx as _jsx } from "react/jsx-runtime";
import { useComponent } from '../../../hooks';
export const FieldValue = (props) => {
    const { path, value, item } = props;
    const { ValueComponent } = useComponent();
    return _jsx(ValueComponent, { path: path, value: value, item: item });
};
