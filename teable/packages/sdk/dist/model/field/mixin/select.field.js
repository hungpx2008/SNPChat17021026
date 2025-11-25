import { ColorUtils, SelectFieldCore } from '@teable/core';
import { keyBy } from 'lodash';
import colors from 'tailwindcss/colors';
export class SelectFieldSdk extends SelectFieldCore {
    _choiceMap = {};
    get displayChoiceMap() {
        if (Object.keys(this._choiceMap).length === 0) {
            const displayedChoices = this.options.choices.map(({ id, name, color }) => {
                return {
                    id,
                    name,
                    color: ColorUtils.shouldUseLightTextOnColor(color) ? colors.white : colors.black,
                    backgroundColor: ColorUtils.getHexForColor(color),
                };
            });
            this._choiceMap = keyBy(displayedChoices, 'name');
        }
        return this._choiceMap;
    }
}
