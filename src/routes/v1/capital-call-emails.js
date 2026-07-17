const express = require('express');
const router = express.Router();
const capitalCallEmailController = require('../../controllers/capitalCallEmailController');
const { authenticate } = require('../../middleware/auth');
const { validateEmailRequest } = require('../../middleware/validation');

/**
 * Capital Call Email Routes
 * Handles capital call and distribution notice emails to LPs
 */

/**
 * @route   POST /api/v1/emails/capital-calls/send
 * @desc    Send capital call notification to LP(s)
 * @access  Private (GP/Admin only)
 */
router.post('/send', authenticate, validateEmailRequest, capitalCallEmailController.sendCapitalCallNotice);

/**
 * @route   POST /api/v1/emails/capital-calls/distribution
 * @desc    Send distribution notice to LP(s)
 * @access  Private (GP/Admin only)
 */
router.post('/distribution', authenticate, validateEmailRequest, capitalCallEmailController.sendDistributionNotice);

/**
 * @route   POST /api/v1/emails/capital-calls/bulk
 * @desc    Send capital call to multiple LPs
 * @access  Private (GP/Admin only)
 */
router.post('/bulk', authenticate, validateEmailRequest, capitalCallEmailController.sendBulkCapitalCalls);

/**
 * @route   POST /api/v1/emails/capital-calls/reminder
 * @desc    Send capital call payment reminder
 * @access  Private (GP/Admin only)
 */
router.post('/reminder', authenticate, validateEmailRequest, capitalCallEmailController.sendCapitalCallReminder);

module.exports = router;
