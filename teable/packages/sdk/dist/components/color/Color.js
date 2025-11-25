import { useTranslation } from '../../context/app/i18n';
export const Color = (props) => {
    const { children } = props;
    const { t } = useTranslation();
    return children(t('color.label'), false);
};
