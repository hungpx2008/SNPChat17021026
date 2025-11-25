"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funcDefine = void 0;
/* eslint-disable sonarjs/no-duplicate-string */
const core_1 = require("@teable/core");
exports.funcDefine = [
    // Numeric
    [
        core_1.FunctionName.Sum,
        {
            name: core_1.FunctionName.Sum,
            func: core_1.FUNCTIONS[core_1.FunctionName.Sum],
            params: ['number1', '[number2, ...]'],
            definition: 'SUM(number1, [number2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Average,
        {
            name: core_1.FunctionName.Average,
            func: core_1.FUNCTIONS[core_1.FunctionName.Average],
            params: ['number1', '[number2, ...]'],
            definition: 'AVERAGE(number1, [number2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Max,
        {
            name: core_1.FunctionName.Max,
            func: core_1.FUNCTIONS[core_1.FunctionName.Max],
            params: ['number1', '[number2, ...]'],
            definition: 'MAX(number1, [number2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Min,
        {
            name: core_1.FunctionName.Min,
            func: core_1.FUNCTIONS[core_1.FunctionName.Min],
            params: ['number1', '[number2, ...]'],
            definition: 'MIN(number1, [number2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Round,
        {
            name: core_1.FunctionName.Round,
            func: core_1.FUNCTIONS[core_1.FunctionName.Round],
            params: ['value', '[precision]'],
            definition: 'ROUND(value, [precision])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.RoundUp,
        {
            name: core_1.FunctionName.RoundUp,
            func: core_1.FUNCTIONS[core_1.FunctionName.RoundUp],
            params: ['value', '[precision]'],
            definition: 'ROUNDUP(value, [precision])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.RoundDown,
        {
            name: core_1.FunctionName.RoundDown,
            func: core_1.FUNCTIONS[core_1.FunctionName.RoundDown],
            params: ['value', '[precision]'],
            definition: 'ROUNDDOWN(value, [precision])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Ceiling,
        {
            name: core_1.FunctionName.Ceiling,
            func: core_1.FUNCTIONS[core_1.FunctionName.Ceiling],
            params: ['value', '[significance]'],
            definition: 'CEILING(value, [significance])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Floor,
        {
            name: core_1.FunctionName.Floor,
            func: core_1.FUNCTIONS[core_1.FunctionName.Floor],
            params: ['value', '[significance]'],
            definition: 'FLOOR(value, [significance])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Even,
        {
            name: core_1.FunctionName.Even,
            func: core_1.FUNCTIONS[core_1.FunctionName.Even],
            params: ['value'],
            definition: 'EVEN(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Odd,
        {
            name: core_1.FunctionName.Odd,
            func: core_1.FUNCTIONS[core_1.FunctionName.Odd],
            params: ['value'],
            definition: 'ODD(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Int,
        {
            name: core_1.FunctionName.Int,
            func: core_1.FUNCTIONS[core_1.FunctionName.Int],
            params: ['value'],
            definition: 'INT(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Abs,
        {
            name: core_1.FunctionName.Abs,
            func: core_1.FUNCTIONS[core_1.FunctionName.Abs],
            params: ['value'],
            definition: 'ABS(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Sqrt,
        {
            name: core_1.FunctionName.Sqrt,
            func: core_1.FUNCTIONS[core_1.FunctionName.Sqrt],
            params: ['value'],
            definition: 'SQRT(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Power,
        {
            name: core_1.FunctionName.Power,
            func: core_1.FUNCTIONS[core_1.FunctionName.Power],
            params: ['value'],
            definition: 'POWER(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Exp,
        {
            name: core_1.FunctionName.Exp,
            func: core_1.FUNCTIONS[core_1.FunctionName.Exp],
            params: ['value'],
            definition: 'EXP(value)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Log,
        {
            name: core_1.FunctionName.Log,
            func: core_1.FUNCTIONS[core_1.FunctionName.Log],
            params: ['value', '[base=10]'],
            definition: 'LOG(number, [base=10]))',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Mod,
        {
            name: core_1.FunctionName.Mod,
            func: core_1.FUNCTIONS[core_1.FunctionName.Mod],
            params: ['value', 'divisor'],
            definition: 'MOD(value, divisor)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Value,
        {
            name: core_1.FunctionName.Value,
            func: core_1.FUNCTIONS[core_1.FunctionName.Value],
            params: ['text'],
            definition: 'VALUE(text)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    // Text
    [
        core_1.FunctionName.Concatenate,
        {
            name: core_1.FunctionName.Concatenate,
            func: core_1.FUNCTIONS[core_1.FunctionName.Concatenate],
            params: ['text1', '[text2, ...]'],
            definition: 'CONCATENATE(text1, [text2, ...])',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Find,
        {
            name: core_1.FunctionName.Find,
            func: core_1.FUNCTIONS[core_1.FunctionName.Find],
            params: ['stringToFind', 'whereToSearch', '[startFromPosition]'],
            definition: 'FIND(stringToFind, whereToSearch, [startFromPosition])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Search,
        {
            name: core_1.FunctionName.Search,
            func: core_1.FUNCTIONS[core_1.FunctionName.Search],
            params: ['stringToFind', 'whereToSearch', '[startFromPosition]'],
            definition: 'SEARCH(stringToFind, whereToSearch, [startFromPosition])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Mid,
        {
            name: core_1.FunctionName.Mid,
            func: core_1.FUNCTIONS[core_1.FunctionName.Mid],
            params: ['text', 'whereToStart', 'count'],
            definition: 'MID(text, whereToStart, count)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Left,
        {
            name: core_1.FunctionName.Left,
            func: core_1.FUNCTIONS[core_1.FunctionName.Left],
            params: ['text', 'count'],
            definition: 'LEFT(text, count)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Right,
        {
            name: core_1.FunctionName.Right,
            func: core_1.FUNCTIONS[core_1.FunctionName.Right],
            params: ['text', 'count'],
            definition: 'RIGHT(text, count)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Replace,
        {
            name: core_1.FunctionName.Replace,
            func: core_1.FUNCTIONS[core_1.FunctionName.Replace],
            params: ['text', 'whereToStart', 'count', 'replacement'],
            definition: 'REPLACE(text, whereToStart, count, replacement)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.RegExpReplace,
        {
            name: core_1.FunctionName.RegExpReplace,
            func: core_1.FUNCTIONS[core_1.FunctionName.RegExpReplace],
            params: ['text', 'regular_expression', 'replacement'],
            definition: 'REGEXP_REPLACE(text, regular_expression, replacement)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Substitute,
        {
            name: core_1.FunctionName.Substitute,
            func: core_1.FUNCTIONS[core_1.FunctionName.Substitute],
            params: ['text', 'oldText', 'newText', '[index]'],
            definition: 'SUBSTITUTE(text, oldText, newText, [index])',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Lower,
        {
            name: core_1.FunctionName.Lower,
            func: core_1.FUNCTIONS[core_1.FunctionName.Lower],
            params: ['text'],
            definition: 'LOWER(text)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Upper,
        {
            name: core_1.FunctionName.Upper,
            func: core_1.FUNCTIONS[core_1.FunctionName.Upper],
            params: ['text'],
            definition: 'UPPER(text)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Rept,
        {
            name: core_1.FunctionName.Rept,
            func: core_1.FUNCTIONS[core_1.FunctionName.Rept],
            params: ['text', 'number'],
            definition: 'REPT(text, number)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Trim,
        {
            name: core_1.FunctionName.Trim,
            func: core_1.FUNCTIONS[core_1.FunctionName.Trim],
            params: ['text'],
            definition: 'TRIM(text)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Len,
        {
            name: core_1.FunctionName.Len,
            func: core_1.FUNCTIONS[core_1.FunctionName.Len],
            params: ['text'],
            definition: 'LEN(text)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.T,
        {
            name: core_1.FunctionName.T,
            func: core_1.FUNCTIONS[core_1.FunctionName.T],
            params: ['value'],
            definition: 'T(value)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.EncodeUrlComponent,
        {
            name: core_1.FunctionName.EncodeUrlComponent,
            func: core_1.FUNCTIONS[core_1.FunctionName.EncodeUrlComponent],
            params: ['value'],
            definition: 'ENCODE_URL_COMPONENT(value)',
            returnType: core_1.CellValueType.String,
        },
    ],
    // Logical
    [
        core_1.FunctionName.If,
        {
            name: core_1.FunctionName.If,
            func: core_1.FUNCTIONS[core_1.FunctionName.If],
            params: ['logical', 'value1', 'value2'],
            definition: 'IF(logical, value1, value2)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Switch,
        {
            name: core_1.FunctionName.Switch,
            func: core_1.FUNCTIONS[core_1.FunctionName.Switch],
            params: ['expression', '[pattern, result]...', '[default]'],
            definition: 'SWITCH(expression, [pattern, result]..., [default])',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.And,
        {
            name: core_1.FunctionName.And,
            func: core_1.FUNCTIONS[core_1.FunctionName.And],
            params: ['logical1', '[logical2, ...]'],
            definition: 'AND(logical1, [logical2, ...])',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.Or,
        {
            name: core_1.FunctionName.Or,
            func: core_1.FUNCTIONS[core_1.FunctionName.Or],
            params: ['logical1', '[logical2, ...]'],
            definition: 'OR(logical1, [logical2, ...])',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.Xor,
        {
            name: core_1.FunctionName.Xor,
            func: core_1.FUNCTIONS[core_1.FunctionName.Xor],
            params: ['logical1', '[logical2, ...]'],
            definition: 'XOR(logical1, [logical2, ...])',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.Not,
        {
            name: core_1.FunctionName.Not,
            func: core_1.FUNCTIONS[core_1.FunctionName.Not],
            params: ['boolean'],
            definition: 'NOT(boolean)',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.Blank,
        {
            name: core_1.FunctionName.Blank,
            func: core_1.FUNCTIONS[core_1.FunctionName.Blank],
            params: [],
            definition: 'BLANK()',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Error,
        {
            name: core_1.FunctionName.Error,
            func: core_1.FUNCTIONS[core_1.FunctionName.Error],
            params: ['message'],
            definition: 'ERROR(message)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.IsError,
        {
            name: core_1.FunctionName.IsError,
            func: core_1.FUNCTIONS[core_1.FunctionName.IsError],
            params: ['expr'],
            definition: 'IS_ERROR(expr)',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    // Date
    [
        core_1.FunctionName.Today,
        {
            name: core_1.FunctionName.Today,
            func: core_1.FUNCTIONS[core_1.FunctionName.Today],
            params: [],
            definition: 'TODAY()',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.Now,
        {
            name: core_1.FunctionName.Now,
            func: core_1.FUNCTIONS[core_1.FunctionName.Now],
            params: [],
            definition: 'NOW()',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.Year,
        {
            name: core_1.FunctionName.Year,
            func: core_1.FUNCTIONS[core_1.FunctionName.Year],
            params: ['date'],
            definition: 'YEAR(date)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Month,
        {
            name: core_1.FunctionName.Month,
            func: core_1.FUNCTIONS[core_1.FunctionName.Month],
            params: ['date'],
            definition: 'MONTH(date)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.WeekNum,
        {
            name: core_1.FunctionName.WeekNum,
            func: core_1.FUNCTIONS[core_1.FunctionName.WeekNum],
            params: ['date'],
            definition: 'WEEKNUM(date)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Weekday,
        {
            name: core_1.FunctionName.Weekday,
            func: core_1.FUNCTIONS[core_1.FunctionName.Weekday],
            params: ['date', '[startDayOfWeek]'],
            definition: 'WEEKDAY(date, [startDayOfWeek])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Day,
        {
            name: core_1.FunctionName.Day,
            func: core_1.FUNCTIONS[core_1.FunctionName.Day],
            params: ['date'],
            definition: 'DAY(date, [startDayOfWeek])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Hour,
        {
            name: core_1.FunctionName.Hour,
            func: core_1.FUNCTIONS[core_1.FunctionName.Hour],
            params: ['date'],
            definition: 'HOUR(date, [startDayOfWeek])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Minute,
        {
            name: core_1.FunctionName.Minute,
            func: core_1.FUNCTIONS[core_1.FunctionName.Minute],
            params: ['date'],
            definition: 'MINUTE(date, [startDayOfWeek])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Second,
        {
            name: core_1.FunctionName.Second,
            func: core_1.FUNCTIONS[core_1.FunctionName.Second],
            params: ['date'],
            definition: 'SECOND(date, [startDayOfWeek])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.FromNow,
        {
            name: core_1.FunctionName.FromNow,
            func: core_1.FUNCTIONS[core_1.FunctionName.FromNow],
            params: ['date', 'unit'],
            definition: 'FROMNOW(date, unit)',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.ToNow,
        {
            name: core_1.FunctionName.ToNow,
            func: core_1.FUNCTIONS[core_1.FunctionName.ToNow],
            params: ['date', 'unit'],
            definition: 'TONOW(date, unit)',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.DatetimeDiff,
        {
            name: core_1.FunctionName.DatetimeDiff,
            func: core_1.FUNCTIONS[core_1.FunctionName.DatetimeDiff],
            params: ['date1', 'date2', '[unit]'],
            definition: 'DATETIME_DIFF(date1, date2, [unit])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Workday,
        {
            name: core_1.FunctionName.Workday,
            func: core_1.FUNCTIONS[core_1.FunctionName.Workday],
            params: ['date', 'count', '[holidayStr]'],
            definition: 'WORKDAY(date, count, [holidayStr])',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.WorkdayDiff,
        {
            name: core_1.FunctionName.WorkdayDiff,
            func: core_1.FUNCTIONS[core_1.FunctionName.WorkdayDiff],
            params: ['date1', 'date2', '[holidayStr]'],
            definition: 'WORKDAY_DIFF(date1, date2, [holidayStr])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.IsSame,
        {
            name: core_1.FunctionName.IsSame,
            func: core_1.FUNCTIONS[core_1.FunctionName.IsSame],
            params: ['date1', 'date2', '[unit]'],
            definition: 'IS_SAME(date1, date2, [unit])',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.IsAfter,
        {
            name: core_1.FunctionName.IsAfter,
            func: core_1.FUNCTIONS[core_1.FunctionName.IsAfter],
            params: ['date1', 'date2', '[unit]'],
            definition: 'IS_AFTER(date1, date2, [unit])',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.IsBefore,
        {
            name: core_1.FunctionName.IsBefore,
            func: core_1.FUNCTIONS[core_1.FunctionName.IsBefore],
            params: ['date1', 'date2', '[unit]'],
            definition: 'IS_BEFORE(date1, date2, [unit])',
            returnType: core_1.CellValueType.Boolean,
        },
    ],
    [
        core_1.FunctionName.DateAdd,
        {
            name: core_1.FunctionName.DateAdd,
            func: core_1.FUNCTIONS[core_1.FunctionName.DateAdd],
            params: ['date1', 'count', '[unit]'],
            definition: 'DATE_ADD(date, count, units)',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.Datestr,
        {
            name: core_1.FunctionName.Datestr,
            func: core_1.FUNCTIONS[core_1.FunctionName.Datestr],
            params: ['date'],
            definition: 'DATESTR(date)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.Timestr,
        {
            name: core_1.FunctionName.Timestr,
            func: core_1.FUNCTIONS[core_1.FunctionName.Timestr],
            params: ['date'],
            definition: 'TIMESTR(date)',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.DatetimeFormat,
        {
            name: core_1.FunctionName.DatetimeFormat,
            func: core_1.FUNCTIONS[core_1.FunctionName.DatetimeFormat],
            params: ['date', '[specified_output_format]'],
            definition: 'DATETIME_FORMAT(date, [specified_output_format])',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.DatetimeParse,
        {
            name: core_1.FunctionName.DatetimeParse,
            func: core_1.FUNCTIONS[core_1.FunctionName.DatetimeParse],
            params: ['date', '[input_format]'],
            definition: 'DATETIME_PARSE(date, [input_format])',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.CreatedTime,
        {
            name: core_1.FunctionName.CreatedTime,
            func: core_1.FUNCTIONS[core_1.FunctionName.CreatedTime],
            params: [],
            definition: 'CREATED_TIME()',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    [
        core_1.FunctionName.LastModifiedTime,
        {
            name: core_1.FunctionName.LastModifiedTime,
            func: core_1.FUNCTIONS[core_1.FunctionName.LastModifiedTime],
            params: [],
            definition: 'LAST_MODIFIED_TIME()',
            returnType: core_1.CellValueType.DateTime,
        },
    ],
    // Array
    [
        core_1.FunctionName.CountAll,
        {
            name: core_1.FunctionName.CountAll,
            func: core_1.FUNCTIONS[core_1.FunctionName.CountAll],
            params: ['value1', '[value2, ...]'],
            definition: 'COUNTALL(value1, [value2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.CountA,
        {
            name: core_1.FunctionName.CountA,
            func: core_1.FUNCTIONS[core_1.FunctionName.CountA],
            params: ['value1', '[value2, ...]'],
            definition: 'COUNTA(value1, [value2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.Count,
        {
            name: core_1.FunctionName.Count,
            func: core_1.FUNCTIONS[core_1.FunctionName.Count],
            params: ['value1', '[value2, ...]'],
            definition: 'COUNT(value1, [value2, ...])',
            returnType: core_1.CellValueType.Number,
        },
    ],
    [
        core_1.FunctionName.ArrayJoin,
        {
            name: core_1.FunctionName.ArrayJoin,
            func: core_1.FUNCTIONS[core_1.FunctionName.ArrayJoin],
            params: ['array', '[separator]'],
            definition: 'ARRAY_JOIN(array, [separator])',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.ArrayUnique,
        {
            name: core_1.FunctionName.ArrayUnique,
            func: core_1.FUNCTIONS[core_1.FunctionName.ArrayUnique],
            params: ['array'],
            definition: 'ARRAY_UNIQUE(array)',
            returnType: 'array',
        },
    ],
    [
        core_1.FunctionName.ArrayFlatten,
        {
            name: core_1.FunctionName.ArrayFlatten,
            func: core_1.FUNCTIONS[core_1.FunctionName.ArrayFlatten],
            params: ['array'],
            definition: 'ARRAY_FLATTEN(array)',
            returnType: 'array',
        },
    ],
    [
        core_1.FunctionName.ArrayCompact,
        {
            name: core_1.FunctionName.ArrayCompact,
            func: core_1.FUNCTIONS[core_1.FunctionName.ArrayCompact],
            params: ['array'],
            definition: 'ARRAY_COMPACT(array)',
            returnType: 'array',
        },
    ],
    [
        core_1.FunctionName.RecordId,
        {
            name: core_1.FunctionName.RecordId,
            func: core_1.FUNCTIONS[core_1.FunctionName.RecordId],
            params: [],
            definition: 'RECORD_ID()',
            returnType: core_1.CellValueType.String,
        },
    ],
    [
        core_1.FunctionName.AutoNumber,
        {
            name: core_1.FunctionName.AutoNumber,
            func: core_1.FUNCTIONS[core_1.FunctionName.AutoNumber],
            params: [],
            definition: 'AUTO_NUMBER()',
            returnType: core_1.CellValueType.Number,
        },
    ],
];
