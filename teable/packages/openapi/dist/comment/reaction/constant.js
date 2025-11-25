"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emojis = exports.SUPPORT_EMOJIS = exports.EmojiSymbol = void 0;
var EmojiSymbol;
(function (EmojiSymbol) {
    EmojiSymbol["thumbsup"] = "\uD83D\uDC4D";
    EmojiSymbol["thumbsdown"] = "\uD83D\uDC4E";
    EmojiSymbol["smile"] = "\uD83D\uDE04";
    EmojiSymbol["heart"] = "\u2764\uFE0F";
    EmojiSymbol["eyes"] = "\uD83D\uDC40";
    EmojiSymbol["rocket"] = "\uD83D\uDE80";
    EmojiSymbol["tada"] = "\uD83C\uDF89";
})(EmojiSymbol || (exports.EmojiSymbol = EmojiSymbol = {}));
exports.SUPPORT_EMOJIS = [
    EmojiSymbol.thumbsup,
    EmojiSymbol.thumbsdown,
    EmojiSymbol.smile,
    EmojiSymbol.heart,
    EmojiSymbol.eyes,
    EmojiSymbol.rocket,
    EmojiSymbol.tada,
];
exports.Emojis = [
    {
        key: 'thumbsup',
        value: EmojiSymbol.thumbsup,
        unified: '1f44d',
        unifiedWithoutSkinTone: '1f44d',
    },
    {
        key: 'thumbsdown',
        value: EmojiSymbol.thumbsdown,
        unified: '1f44e',
        unifiedWithoutSkinTone: '1f44e',
    },
    {
        key: 'smile',
        value: EmojiSymbol.smile,
        unified: '1f604',
        unifiedWithoutSkinTone: '1f604',
    },
    {
        key: 'heart',
        value: EmojiSymbol.heart,
        unified: '2764-fe0f',
        unifiedWithoutSkinTone: '2764-fe0f',
    },
    {
        key: 'eyes',
        value: EmojiSymbol.eyes,
        unified: '1f440',
        unifiedWithoutSkinTone: '1f440',
    },
    {
        key: 'rocket',
        value: EmojiSymbol.rocket,
        unified: '1f680',
        unifiedWithoutSkinTone: '1f680',
    },
    {
        key: 'tada',
        value: EmojiSymbol.tada,
        unified: '1f389',
        unifiedWithoutSkinTone: '1f389',
    },
];
