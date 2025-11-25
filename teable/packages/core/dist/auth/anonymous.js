"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnonymous = exports.ANONYMOUS_USER_ID = void 0;
exports.ANONYMOUS_USER_ID = 'anonymous';
const isAnonymous = (userId) => userId === exports.ANONYMOUS_USER_ID;
exports.isAnonymous = isAnonymous;
