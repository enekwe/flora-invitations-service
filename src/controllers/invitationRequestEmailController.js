const logger = require('../config/logger');
const templateService = require('../services/templateService');
const emailService = require('../services/emailService');

/**
 * Invitation Request Email Controller
 * Handles 5-step invitation request workflow emails:
 * 1. Request confirmation (to requester)
 * 2. Admin notification (to admin)
 * 3. Approval notification (to requester)
 * 4. Denial notification (to requester)
 * 5. Follow-up reminder (to admin or requester)
 */

/**
 * Send invitation request confirmation
 * Step 1: User submits invitation request, receives confirmation
 * @route POST /api/v1/emails/invitation-requests/confirmation
 */
exports.sendRequestConfirmation = async (req, res) => {
  try {
    const {
      email,
      name,
      requestType,
      requestDetails,
      submittedAt,
      requestId
    } = req.body;

    // Validate required fields
    if (!email || !name || !requestType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, name, requestType'
      });
    }

    logger.info('Invitation request confirmation requested', {
      email,
      requestType,
      requestId
    });

    // Prepare template variables
    const variables = {
      name,
      email,
      requestType: requestType || 'General Invitation',
      requestDetails: requestDetails || 'Your invitation request has been submitted.',
      submittedAt: submittedAt || new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      requestId: requestId || `REQ-${Date.now()}`,
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render invitation request confirmation template
    const htmlContent = await templateService.renderTemplate(
      'invitation-requests/invitation-request-confirmation',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name
      },
      subject: `✅ Invitation Request Received - ${requestType}`,
      htmlContent
    });

    logger.info('Invitation request confirmation sent successfully', {
      email,
      requestType,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Invitation request confirmation sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Invitation request confirmation error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send invitation request confirmation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send admin notification
 * Step 2: Admin is notified of new invitation request with approve/deny links
 * @route POST /api/v1/emails/invitation-requests/admin-notification
 */
exports.sendAdminNotification = async (req, res) => {
  try {
    const {
      adminEmail,
      adminName,
      requesterName,
      requesterEmail,
      requestType,
      requestDetails,
      approveLink,
      denyLink,
      requestId
    } = req.body;

    // Validate required fields
    if (!adminEmail || !requesterEmail || !requestType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: adminEmail, requesterEmail, requestType'
      });
    }

    logger.info('Admin notification for invitation request', {
      adminEmail,
      requesterEmail,
      requestType,
      requestId
    });

    // Prepare template variables
    const variables = {
      adminName: adminName || 'Admin',
      adminEmail,
      requesterName: requesterName || requesterEmail.split('@')[0],
      requesterEmail,
      requestType,
      requestDetails: requestDetails || 'No additional details provided.',
      approveLink: approveLink || `${process.env.FRONTEND_URL}/admin/invitation-requests/${requestId}/approve`,
      denyLink: denyLink || `${process.env.FRONTEND_URL}/admin/invitation-requests/${requestId}/deny`,
      requestId: requestId || `REQ-${Date.now()}`,
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render admin notification template
    const htmlContent = await templateService.renderTemplate(
      'invitation-requests/invitation-request-admin',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email: adminEmail,
        name: variables.adminName
      },
      subject: `🔔 New Invitation Request: ${requesterName} - ${requestType}`,
      htmlContent
    });

    logger.info('Admin notification sent successfully', {
      adminEmail,
      requesterEmail,
      requestType,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Admin notification sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Admin notification error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send admin notification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send approval notification
 * Step 3: User is notified their invitation request was approved
 * @route POST /api/v1/emails/invitation-requests/approved
 */
exports.sendApprovalNotification = async (req, res) => {
  try {
    const {
      email,
      name,
      requestType,
      approvedBy,
      approvalMessage,
      invitationLink,
      nextSteps,
      requestId
    } = req.body;

    // Validate required fields
    if (!email || !name || !requestType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, name, requestType'
      });
    }

    logger.info('Invitation request approval notification', {
      email,
      requestType,
      requestId
    });

    // Prepare template variables
    const variables = {
      name,
      email,
      requestType,
      approvedBy: approvedBy || 'Fund Administrator',
      approvalMessage: approvalMessage || 'Your invitation request has been approved!',
      invitationLink: invitationLink || `${process.env.FRONTEND_URL}/accept-invitation`,
      nextSteps: nextSteps || 'Click the link below to complete your registration.',
      requestId: requestId || `REQ-${Date.now()}`,
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render approval notification template
    const htmlContent = await templateService.renderTemplate(
      'invitation-requests/invitation-request-approved',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name
      },
      subject: `🎉 Invitation Request Approved - ${requestType}`,
      htmlContent
    });

    logger.info('Approval notification sent successfully', {
      email,
      requestType,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Approval notification sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Approval notification error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send approval notification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send denial notification
 * Step 4: User is notified their invitation request was denied
 * @route POST /api/v1/emails/invitation-requests/denied
 */
exports.sendDenialNotification = async (req, res) => {
  try {
    const {
      email,
      name,
      requestType,
      deniedBy,
      denialReason,
      appealProcess,
      requestId
    } = req.body;

    // Validate required fields
    if (!email || !name || !requestType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, name, requestType'
      });
    }

    logger.info('Invitation request denial notification', {
      email,
      requestType,
      requestId
    });

    // Prepare template variables
    const variables = {
      name,
      email,
      requestType,
      deniedBy: deniedBy || 'Fund Administrator',
      denialReason: denialReason || 'Your request could not be approved at this time.',
      appealProcess: appealProcess || 'If you have questions, please contact our support team.',
      requestId: requestId || `REQ-${Date.now()}`,
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render denial notification template
    const htmlContent = await templateService.renderTemplate(
      'invitation-requests/invitation-request-denied',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name
      },
      subject: `❌ Invitation Request Update - ${requestType}`,
      htmlContent
    });

    logger.info('Denial notification sent successfully', {
      email,
      requestType,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Denial notification sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Denial notification error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send denial notification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send follow-up reminder
 * Step 5: Follow-up reminder for pending invitation requests
 * @route POST /api/v1/emails/invitation-requests/followup
 */
exports.sendFollowupReminder = async (req, res) => {
  try {
    const {
      email,
      name,
      recipientType,
      requestType,
      submittedAt,
      daysPending,
      actionLink,
      requestId
    } = req.body;

    // Validate required fields
    if (!email || !name || !recipientType || !requestType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, name, recipientType, requestType'
      });
    }

    logger.info('Invitation request follow-up reminder', {
      email,
      recipientType,
      requestType,
      daysPending,
      requestId
    });

    // Prepare template variables
    const variables = {
      name,
      email,
      recipientType: recipientType, // 'admin' or 'requester'
      requestType,
      submittedAt: submittedAt || 'Recently',
      daysPending: daysPending || 'several',
      actionLink: actionLink || `${process.env.FRONTEND_URL}/invitation-requests`,
      requestId: requestId || `REQ-${Date.now()}`,
      reminderMessage: recipientType === 'admin'
        ? 'This invitation request is still pending your review.'
        : 'Your invitation request is still being processed.',
      actionText: recipientType === 'admin'
        ? 'Review Request'
        : 'View Status',
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render follow-up reminder template
    const htmlContent = await templateService.renderTemplate(
      'invitation-requests/invitation-request-followup',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name
      },
      subject: `🔔 Reminder: Pending Invitation Request - ${requestType}`,
      htmlContent
    });

    logger.info('Follow-up reminder sent successfully', {
      email,
      recipientType,
      requestType,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Follow-up reminder sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Follow-up reminder error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send follow-up reminder',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
