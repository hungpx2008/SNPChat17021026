import { jsx as _jsx } from "react/jsx-runtime";
import { useComponent } from '../../../hooks';
export const OperatorSelect = (props) => {
    const { path, value, item } = props;
    const { OperatorComponent } = useComponent();
    return _jsx(OperatorComponent, { path: path, value: value, item: item });
};
