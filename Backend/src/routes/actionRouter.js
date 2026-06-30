const express = require("express");
const router = express.Router();

const {
    generateActionItems,
    getActionItems,
    updateStatus,
    deleteActionItem
} = require("../controllers/action.controller");

// Generate Action Items
router.post("/generate", generateActionItems);

// Get Action Items by Meeting ID
router.get("/:meetingId", getActionItems);

// Update Action Item Status
router.put("/:id", updateStatus);

// Delete Action Item
router.delete("/:id", deleteActionItem);

module.exports = router;