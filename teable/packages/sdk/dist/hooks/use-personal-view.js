import { useContext } from 'react';
import { PersonalViewContext } from '../context/view/PersonalViewContext';
import { usePersonalViewStore } from '../context/view/store';
import { generatePersonalViewProps } from '../utils/personalView';
import { useView } from './use-view';
export const usePersonalView = () => {
    const { isPersonalView, personalViewMap, personalViewCommonQuery, personalViewAggregationQuery } = useContext(PersonalViewContext);
    const { removePersonalView, setPersonalViewMap } = usePersonalViewStore();
    const view = useView();
    const viewId = view?.id ?? '';
    const closePersonalView = () => {
        removePersonalView(viewId);
    };
    const openPersonalView = () => {
        setPersonalViewMap(viewId, (prev) => {
            return { ...prev, ...generatePersonalViewProps(view) };
        });
    };
    const syncViewProperties = async () => {
        await view?.syncViewProperties?.();
    };
    return {
        isPersonalView,
        personalViewMap,
        personalViewCommonQuery,
        personalViewAggregationQuery,
        openPersonalView,
        closePersonalView,
        syncViewProperties,
    };
};
