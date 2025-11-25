import { getFields, BaseQueryColumnType } from '@teable/openapi';
import { useState, useEffect } from 'react';
export const useQueryContext = (tableIds) => {
    const [context, setContext] = useState([]);
    useEffect(() => {
        const fetchContext = async () => {
            const fields = await Promise.all(tableIds.map((tableId) => getFields(tableId).then((res) => res.data.map((v) => ({ ...v, tableId })))));
            setContext(fields.flat().map((field) => ({
                column: field.id,
                type: BaseQueryColumnType.Field,
                name: field.name,
                fieldSource: field,
                tableId: field.tableId,
            })));
        };
        fetchContext();
    }, [tableIds]);
    return context;
};
