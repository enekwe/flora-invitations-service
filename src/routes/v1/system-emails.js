const express = require('express');
const router = express.Router();
const systemEmailController = require('../../controllers/systemEmailController');
const { authenticate } = require('../../middleware/auth');
const { validateEmailRequest } = require('../../middleware/validation');

/**
 * System Email Routes
 * Handles system-wide notifications like maintenance alerts
 */

/**
 * @route   POST /api/v1/emails/system/maintenance
 * @desc    Send system maintenance notification to all users
 * @access  Private (Admin only)
 */
router.post('/maintenance', authenticate, validateEmailRequest, systemEmailController.sendMaintenanceNotification);

/**
 * @route   POST /api/v1/emails/system/announcement
 * @desc    Send system-wide announcement
 * @access  Private (Admin only)
 */
router.post('/announcement', authenticate, validateEmailRequest, systemEmailController.sendAnnouncement);

/**
 * @route   POST /api/v1/emails/system/bulk
 * @desc    Send bulk email to multiple users
 * @access  Private (Admin only)
 */
router.post('/bulk', authenticate, validateEmailRequest, systemEmailController.sendBulkEmails);

module.exports = router;
