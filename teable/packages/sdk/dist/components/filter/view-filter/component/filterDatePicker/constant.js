import { daysAgo, daysFromNow, exactDate, exactFormatDate, nextNumberOfDays, pastNumberOfDays, } from '@teable/core';
const INPUTOPTIONS = [
    daysAgo.value,
    daysFromNow.value,
    pastNumberOfDays.value,
    nextNumberOfDays.value,
];
const DATEPICKEROPTIONS = [exactDate.value, exactFormatDate.value];
const defaultValue = {
    mode: exactDate.value,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};
const withInDefaultValue = {
    mode: nextNumberOfDays.value,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};
export { DATEPICKEROPTIONS, INPUTOPTIONS, defaultValue, withInDefaultValue };
