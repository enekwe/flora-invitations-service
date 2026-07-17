const logger = require('../config/logger');
const templateService = require('../services/templateService');
const emailService = require('../services/emailService');

/**
 * Document Email Controller
 * Handles document-related emails: upload notifications, signature requests, completions, reminders
 */

/**
 * Send document upload notification
 * @route POST /api/v1/emails/documents/upload-notification
 */
exports.sendDocumentUploadNotification = async (req, res) => {
  try {
    const {
      email,
      name,
      documentName,
      uploadedBy,
      uploadedAt,
      viewLink,
      documentType,
      fileSize,
      description
    } = req.body;

    // Validate required fields
    if (!email || !documentName || !uploadedBy || !viewLink) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, documentName, uploadedBy, viewLink'
      });
    }

    logger.info('Document upload notification requested', {
      email,
      documentName,
      uploadedBy
    });

    // Prepare template variables
    const variables = {
      name: name || email.split('@')[0],
      email,
      documentName,
      uploadedBy,
      uploadedAt: uploadedAt || new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      viewLink,
      documentType: documentType || 'Document',
      fileSize: fileSize || 'N/A',
      description: description || `A new document has been uploaded for your review.`,
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render document notification template
    const htmlContent = await templateService.renderTemplate(
      'documents/document-notification',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name: variables.name
      },
      subject: `📄 New Document: ${documentName}`,
      htmlContent
    });

    logger.info('Document upload notification sent successfully', {
      email,
      documentName,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Document upload notification sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Document upload notification error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send document upload notification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send signature request
 * @route POST /api/v1/emails/documents/signature-request
 */
exports.sendSignatureRequest = async (req, res) => {
  try {
    const {
      email,
      name,
      documentName,
      requestedBy,
      signatureLink,
      dueDate,
      documentType,
      description,
      urgency
    } = req.body;

    // Validate required fields
    if (!email || !documentName || !requestedBy || !signatureLink) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, documentName, requestedBy, signatureLink'
      });
    }

    logger.info('Signature request email requested', {
      email,
      documentName,
      requestedBy
    });

    // Prepare template variables
    const variables = {
      name: name || email.split('@')[0],
      email,
      documentName,
      requestedBy,
      signatureLink,
      dueDate: dueDate || 'At your earliest convenience',
      documentType: documentType || 'Document',
      description: description || `Your signature is required on the following document.`,
      urgency: urgency || 'normal',
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render signature request template (using document notification with modified context)
    const htmlContent = await templateService.renderTemplate(
      'documents/document-notification',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name: variables.name
      },
      subject: `✍️ Signature Required: ${documentName}`,
      htmlContent
    });

    logger.info('Signature request sent successfully', {
      email,
      documentName,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Signature request sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Signature request error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send signature request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send signature complete notification
 * @route POST /api/v1/emails/documents/signature-complete
 */
exports.sendSignatureComplete = async (req, res) => {
  try {
    const {
      email,
      name,
      documentName,
      signedBy,
      signedAt,
      viewLink,
      allPartiesSigned,
      documentType
    } = req.body;

    // Validate required fields
    if (!email || !documentName || !signedBy || !viewLink) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, documentName, signedBy, viewLink'
      });
    }

    logger.info('Signature complete notification requested', {
      email,
      documentName,
      signedBy
    });

    // Prepare template variables
    const variables = {
      name: name || email.split('@')[0],
      email,
      documentName,
      signedBy,
      signedAt: signedAt || new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      viewLink,
      allPartiesSigned: allPartiesSigned !== undefined ? allPartiesSigned : true,
      documentType: documentType || 'Document',
      statusMessage: allPartiesSigned
        ? 'All required signatures have been collected. The document is now fully executed.'
        : 'A signature has been added. Awaiting remaining signatures.',
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render signature complete template
    const htmlContent = await templateService.renderTemplate(
      'documents/document-notification',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name: variables.name
      },
      subject: allPartiesSigned
        ? `✅ Document Fully Executed: ${documentName}`
        : `✍️ Signature Added: ${documentName}`,
      htmlContent
    });

    logger.info('Signature complete notification sent successfully', {
      email,
      documentName,
      allPartiesSigned,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Signature complete notification sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Signature complete notification error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send signature complete notification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send signature reminder
 * @route POST /api/v1/emails/documents/signature-reminder
 */
exports.sendSignatureReminder = async (req, res) => {
  try {
    const {
      email,
      name,
      documentName,
      requestedBy,
      signatureLink,
      dueDate,
      daysOverdue,
      reminderNumber
    } = req.body;

    // Validate required fields
    if (!email || !documentName || !signatureLink) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, documentName, signatureLink'
      });
    }

    logger.info('Signature reminder requested', {
      email,
      documentName,
      daysOverdue
    });

    // Prepare template variables
    const variables = {
      name: name || email.split('@')[0],
      email,
      documentName,
      requestedBy: requestedBy || 'Your fund administrator',
      signatureLink,
      dueDate: dueDate || 'As soon as possible',
      daysOverdue: daysOverdue || 0,
      reminderNumber: reminderNumber || 1,
      reminderMessage: daysOverdue > 0
        ? `REMINDER: This signature is ${daysOverdue} days overdue.`
        : `REMINDER: Your signature is still required.`,
      urgency: daysOverdue > 0 ? 'urgent' : 'normal',
      frontendUrl: process.env.FRONTEND_URL || 'https://flora.passbook.vc',
      supportEmail: process.env.BREVO_SENDER_EMAIL || 'flora@passbook.vc',
      currentYear: new Date().getFullYear()
    };

    // Render signature reminder template
    const htmlContent = await templateService.renderTemplate(
      'documents/document-notification',
      variables
    );

    // Send email via Brevo
    const result = await emailService.sendEmail({
      to: {
        email,
        name: variables.name
      },
      subject: daysOverdue > 0
        ? `⚠️ OVERDUE: Signature Required - ${documentName}`
        : `🔔 Reminder: Signature Required - ${documentName}`,
      htmlContent
    });

    logger.info('Signature reminder sent successfully', {
      email,
      documentName,
      daysOverdue,
      messageId: result.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Signature reminder sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    logger.error('Signature reminder error:', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to send signature reminder',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
