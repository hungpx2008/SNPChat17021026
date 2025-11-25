import { jsx as _jsx } from "react/jsx-runtime";
import { useComponent } from '../../../hooks';
export const FieldSelect = (props) => {
    const { path, value, item } = props;
    const { FieldComponent } = useComponent();
    return _jsx(FieldComponent, { path: path, value: value, item: item });
};
