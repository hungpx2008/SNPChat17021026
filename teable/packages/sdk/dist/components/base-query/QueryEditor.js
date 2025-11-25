import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from '@teable/ui-lib';
import { QueryAggregation } from './editors/QueryAggregation';
import { QueryFilter } from './editors/QueryFilter/QueryFilter';
import { QueryGroup } from './editors/QueryGroup';
import { QueryJoin } from './editors/QueryJoin';
import { QueryOrder } from './editors/QueryOrder';
import { QuerySelect } from './editors/QuerySelect';
export const QueryEditor = ({ type, query, onChange, }) => {
    switch (type) {
        case 'select': {
            return (_jsx(QuerySelect, { value: query.select, onChange: (select) => {
                    onChange('select', select);
                } }));
        }
        case 'join': {
            return (_jsx(QueryJoin, { value: query.join, onChange: (join) => {
                    onChange('join', join);
                } }));
        }
        case 'aggregation': {
            return (_jsx(QueryAggregation, { value: query.aggregation, onChange: (aggregation) => onChange('aggregation', aggregation) }));
        }
        case 'groupBy': {
            return (_jsx(QueryGroup, { value: query.groupBy, onChange: (groupBy) => onChange('groupBy', groupBy) }));
        }
        case 'offset':
        case 'limit': {
            return (_jsx(Input, { className: "h-7 w-16 text-[13px]", type: "number", value: query[type], onChange: (e) => onChange(type, Number(e.target.value)) }));
        }
        case 'orderBy': {
            return (_jsx(QueryOrder, { value: query.orderBy, onChange: (orderBy) => {
                    onChange('orderBy', orderBy);
                } }));
        }
        case 'where': {
            return _jsx(QueryFilter, { value: query.where, onChange: (where) => onChange('where', where) });
        }
        default:
            return null;
    }
};
