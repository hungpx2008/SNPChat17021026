import { CellValueType, StatisticsFunc } from '@teable/core';
export const percentFormatting = (value) => {
    if (value % 1 === 0) {
        return value;
    }
    const pow = 100;
    return (Math.floor(value * pow) / pow).toString();
};
export const bytesToMB = (bytes) => {
    const mb = bytes / 1048576;
    return (mb <= 1 ? 0 : mb.toFixed(2)).toString();
};
export const statisticsValue2DisplayValue = (statFunc, value, field) => {
    const { cellValueType } = field;
    switch (statFunc) {
        case StatisticsFunc.Count:
        case StatisticsFunc.Empty:
        case StatisticsFunc.Filled:
        case StatisticsFunc.Unique:
        case StatisticsFunc.Checked:
        case StatisticsFunc.UnChecked:
        case StatisticsFunc.DateRangeOfDays:
        case StatisticsFunc.DateRangeOfMonths: {
            return String(defaultToZero(value, statFunc));
        }
        case StatisticsFunc.Max:
        case StatisticsFunc.Min:
        case StatisticsFunc.Sum:
        case StatisticsFunc.Average:
        case StatisticsFunc.LatestDate:
        case StatisticsFunc.EarliestDate: {
            if ([CellValueType.Number, CellValueType.DateTime].includes(cellValueType)) {
                return field.cellValue2String(defaultToZero(value, statFunc));
            }
            return String(value);
        }
        case StatisticsFunc.PercentEmpty:
        case StatisticsFunc.PercentFilled:
        case StatisticsFunc.PercentUnique:
        case StatisticsFunc.PercentChecked:
        case StatisticsFunc.PercentUnChecked: {
            return `${percentFormatting(value)}%`;
        }
        case StatisticsFunc.TotalAttachmentSize: {
            return `${bytesToMB(value)}MB`;
        }
    }
};
const defaultToZero = (value, statFunc) => {
    const defaultToZero = [
        StatisticsFunc.DateRangeOfDays,
        StatisticsFunc.DateRangeOfMonths,
        StatisticsFunc.Sum,
    ];
    if (defaultToZero.includes(statFunc) && !value) {
        return 0;
    }
    return value;
};
