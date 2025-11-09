"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTitle = isValidTitle;
exports.isValidDescription = isValidDescription;
exports.isValidStatus = isValidStatus;
function isValidTitle(title) {
    return typeof title === "string" && title.trim().length > 0 && title.length <= 120;
}
function isValidDescription(description) {
    return (description === undefined ||
        (typeof description === "string" && description.length <= 2000));
}
function isValidStatus(status) {
    return status === "pending" || status === "in_progress" || status === "done";
}
