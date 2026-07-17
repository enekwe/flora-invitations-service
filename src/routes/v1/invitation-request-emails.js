const express = require('express');
const router = express.Router();
const invitationRequestEmailController = require('../../controllers/invitationRequestEmailController');
const { authenticate } = require('../../middleware/auth');
const { validateEmailRequest } = require('../../middleware/validation');

/**
 * Invitation Request Email Routes
 * Handles the 5-step invitation request workflow emails
 */

/**
 * @route   POST /api/v1/emails/invitation-requests/confirmation
 * @desc    Send invitation request confirmation to requester
 * @access  Public
 */
router.post('/confirmation', validateEmailRequest, invitationRequestEmailController.sendRequestConfirmation);

/**
 * @route   POST /api/v1/emails/invitation-requests/admin-notification
 * @desc    Notify admin of new invitation request
 * @access  Private (Internal)
 */
router.post('/admin-notification', authenticate, validateEmailRequest, invitationRequestEmailController.sendAdminNotification);

/**
 * @route   POST /api/v1/emails/invitation-requests/approved
 * @desc    Notify requester that invitation was approved
 * @access  Private (Admin only)
 */
router.post('/approved', authenticate, validateEmailRequest, invitationRequestEmailController.sendApprovalNotification);

/**
 * @route   POST /api/v1/emails/invitation-requests/denied
 * @desc    Notify requester that invitation was denied
 * @access  Private (Admin only)
 */
router.post('/denied', authenticate, validateEmailRequest, invitationRequestEmailController.sendDenialNotification);

/**
 * @route   POST /api/v1/emails/invitation-requests/followup
 * @desc    Send follow-up reminder for pending invitation request
 * @access  Private (System/Admin)
 */
router.post('/followup', authenticate, validateEmailRequest, invitationRequestEmailController.sendFollowupReminder);

module.exports = router;
