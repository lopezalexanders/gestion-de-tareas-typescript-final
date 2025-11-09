"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canTransition = canTransition;
function canTransition(current, next) {
    if (current === "pending") {
        return next === "in_progress" || next === "done";
    }
    if (current === "in_progress") {
        return next === "done";
    }
    // No allowed transitions from DONE in MVP
    return false;
}
