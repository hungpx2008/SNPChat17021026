"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareViewButtonClick = exports.ShareViewButtonClickRoute = exports.SHARE_VIEW_BUTTON_CLICK = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const button_click_1 = require("../record/button-click");
const utils_1 = require("../utils");
exports.SHARE_VIEW_BUTTON_CLICK = '/share/{shareId}/view/record/{recordId}/{fieldId}/button-click';
exports.ShareViewButtonClickRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SHARE_VIEW_BUTTON_CLICK,
    summary: 'Button click',
    description: 'Button click',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the clicked cell',
            content: {
                'application/json': {
                    schema: button_click_1.buttonClickVoSchema,
                },
            },
        },
    },
    tags: ['share'],
});
async function shareViewButtonClick(shareId, recordId, fieldId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.SHARE_VIEW_BUTTON_CLICK, { shareId, recordId, fieldId }));
}
exports.shareViewButtonClick = shareViewButtonClick;
