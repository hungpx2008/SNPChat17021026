import { jsx as _jsx } from "react/jsx-runtime";
import { BaseSingleSelect } from './base';
const typeOptions = [
    { value: 'image', label: 'image' },
    { value: 'text', label: 'text' },
];
function FileTypeSelect(props) {
    const { value, onSelect } = props;
    return _jsx(BaseSingleSelect, { value: value, onSelect: onSelect, options: typeOptions });
}
export { FileTypeSelect };
