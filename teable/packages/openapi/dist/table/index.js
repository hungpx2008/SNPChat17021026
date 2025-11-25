"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./create"), exports);
__exportStar(require("./delete"), exports);
__exportStar(require("./get-list"), exports);
__exportStar(require("./get"), exports);
__exportStar(require("./permanent-delete"), exports);
__exportStar(require("./update-name"), exports);
__exportStar(require("./update-icon"), exports);
__exportStar(require("./update-order"), exports);
__exportStar(require("./update-description"), exports);
__exportStar(require("./update-db-table-name"), exports);
__exportStar(require("./default-view-id"), exports);
__exportStar(require("./get-permission"), exports);
__exportStar(require("./toggle-table-index"), exports);
__exportStar(require("./get-activated-index"), exports);
__exportStar(require("./get-abnormal-index"), exports);
__exportStar(require("./repair-table-index"), exports);
__exportStar(require("./duplicate"), exports);
