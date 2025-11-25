import { useMutation } from '@tanstack/react-query';
import { convertField as convertFieldApi, createField as createFieldApi, planFieldCreate as planFieldCreateApi, planFieldConvert as planFieldConvertApi, deleteField as deleteFieldApi, autoFillField as autoFillFieldApi, } from '@teable/openapi';
export const useFieldOperations = () => {
    const { mutateAsync: convertField } = useMutation({
        mutationFn: ({ tableId, fieldId, fieldRo, }) => convertFieldApi(tableId, fieldId, fieldRo).then((res) => res.data),
    });
    const { mutateAsync: createField } = useMutation({
        mutationFn: ({ tableId, fieldRo }) => createFieldApi(tableId, fieldRo).then((res) => res.data),
    });
    const { mutateAsync: planFieldCreate } = useMutation({
        mutationFn: ({ tableId, fieldRo }) => planFieldCreateApi(tableId, fieldRo).then((res) => res.data),
    });
    const { mutateAsync: planFieldConvert } = useMutation({
        mutationFn: ({ tableId, fieldId, fieldRo, }) => planFieldConvertApi(tableId, fieldId, fieldRo).then((res) => res.data),
    });
    const { mutateAsync: deleteField } = useMutation({
        mutationFn: ({ tableId, fieldId }) => deleteFieldApi(tableId, fieldId).then((res) => res.data),
    });
    const { mutateAsync: autoFillField } = useMutation({
        mutationFn: ({ tableId, fieldId, query, }) => autoFillFieldApi(tableId, fieldId, query).then((res) => res.data),
    });
    return {
        createField,
        convertField,
        planFieldCreate,
        planFieldConvert,
        deleteField,
        autoFillField,
    };
};
