'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from '@teable/icons';
import { useLinkToolbarButton, useLinkToolbarButtonState } from '@udecode/plate-link/react';
import { useTranslation } from '../../../context/app/i18n';
import { ToolbarButton } from './toolbar';
export function LinkToolbarButton(props) {
    const state = useLinkToolbarButtonState();
    const { props: buttonProps } = useLinkToolbarButton(state);
    const { t } = useTranslation();
    return (_jsx(ToolbarButton, { ...props, ...buttonProps, "data-plate-focus": true, tooltip: t('comment.toolbar.link'), size: 'xs', children: _jsx(Link, { className: "size-3.5" }) }));
}
