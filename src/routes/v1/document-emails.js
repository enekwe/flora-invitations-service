const express = require('express');
const router = express.Router();
const documentEmailController = require('../../controllers/documentEmailController');
const { authenticate } = require('../../middleware/auth');
const { validateEmailRequest } = require('../../middleware/validation');

/**
 * Document Email Routes
 * Handles document upload, signature request, and completion notifications
 */

/**
 * @route   POST /api/v1/emails/documents/upload-notification
 * @desc    Send document upload notification
 * @access  Private
 */
router.post('/upload-notification', authenticate, validateEmailRequest, documentEmailController.sendDocumentUploadNotification);

/**
 * @route   POST /api/v1/emails/documents/signature-request
 * @desc    Send document signature request
 * @access  Private
 */
router.post('/signature-request', authenticate, validateEmailRequest, documentEmailController.sendSignatureRequest);

/**
 * @route   POST /api/v1/emails/documents/signature-complete
 * @desc    Send document signature completion notification
 * @access  Private
 */
router.post('/signature-complete', authenticate, validateEmailRequest, documentEmailController.sendSignatureComplete);

/**
 * @route   POST /api/v1/emails/documents/signature-reminder
 * @desc    Send signature reminder
 * @access  Private
 */
router.post('/signature-reminder', authenticate, validateEmailRequest, documentEmailController.sendSignatureReminder);

module.exports = router;
