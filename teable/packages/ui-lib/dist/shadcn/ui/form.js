import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { cn } from '../utils';
import { Label } from './label';
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = ({ ...props }) => {
    return (_jsx(FormFieldContext.Provider, { value: { name: props.name }, children: _jsx(Controller, { ...props }) }));
};
const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();
    const fieldState = getFieldState(fieldContext.name, formState);
    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }
    const { id } = itemContext;
    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};
const FormItemContext = React.createContext({});
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
    const id = React.useId();
    return (_jsx(FormItemContext.Provider, { value: { id }, children: _jsx("div", { ref: ref, className: cn('space-y-2', className), ...props }) }));
});
FormItem.displayName = 'FormItem';
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();
    return (_jsx(Label, { ref: ref, className: cn(error && 'text-destructive', className), htmlFor: formItemId, ...props }));
});
FormLabel.displayName = 'FormLabel';
const FormControl = React.forwardRef(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (_jsx(Slot, { ref: ref, id: formItemId, "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`, "aria-invalid": !!error, ...props }));
});
FormControl.displayName = 'FormControl';
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();
    return (_jsx("p", { ref: ref, id: formDescriptionId, className: cn('text-[0.8rem] text-muted-foreground', className), ...props }));
});
FormDescription.displayName = 'FormDescription';
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    // fix the array error message, origin formMessage only support string error
    let finalError = error;
    if (!finalError?.message) {
        if (Array.isArray(finalError) && finalError.length) {
            const newError = finalError[0];
            const errorKey = Object.keys(newError)[0];
            finalError = { ...newError[errorKey], message: `${errorKey}: ${newError[errorKey].message}` };
        }
        else if (finalError && Object.keys(finalError).length !== 0) {
            const newError = { ...finalError };
            const errorKey = Object.keys(newError)[0];
            finalError = {
                ...finalError,
                message: `${newError[errorKey].message}`,
            };
        }
    }
    const body = finalError ? String(finalError?.message) : children;
    if (!body) {
        return null;
    }
    return (_jsx("p", { ref: ref, id: formMessageId, className: cn('text-[0.8rem] font-medium text-destructive', className), ...props, children: body }));
});
FormMessage.displayName = 'FormMessage';
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, };
