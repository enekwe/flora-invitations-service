# Flora Email Service - Implementation Plan

**Service Name:** flora-email-service (formerly flora-invitations-service)
**Version:** 2.0.0
**Status:** 🚧 In Progress - Structure Complete, Implementation Pending

---

## Overview

Expanding from a limited invitations-only service to a **comprehensive email microservice** handling ALL email types across the Flora platform.

**Completion:** ~15% (structure + invitations done, 85% implementation remaining)

---

## Phase 1: Structure & Routes ✅ COMPLETE

### ✅ Completed Items

1. **Template Organization**
   - ✅ Copied all 13 email templates from main app
   - ✅ Organized into categories:
     - `invitations/` - 11 invitation templates
     - `auth/` - password-reset, email-verification, welcome
     - `capital-calls/` - capital-call-notification
     - `documents/` - document-notification
     - `invitation-requests/` - 5 workflow templates
     - `system/` - system-maintenance
     - `base-template.html` - Base HTML structure

2. **Route Files Created**
   - ✅ `/api/v1/emails/auth` - auth-emails.js
   - ✅ `/api/v1/emails/capital-calls` - capital-call-emails.js
   - ✅ `/api/v1/emails/documents` - document-emails.js
   - ✅ `/api/v1/emails/invitation-requests` - invitation-request-emails.js
   - ✅ `/api/v1/emails/system` - system-emails.js
   - ✅ `/api/v1/invitations` - invitations.js (existing)

3. **Controller Placeholders Created**
   - ✅ authEmailController.js - 4 methods
   - ✅ capitalCallEmailController.js - 4 methods
   - ✅ documentEmailController.js - 4 methods
   - ✅ invitationRequestEmailController.js - 5 methods
   - ✅ systemEmailController.js - 3 methods
   - ✅ invitationsController.js (existing, functional)

4. **Server Configuration**
   - ✅ Updated server.js to mount all 6 route groups
   - ✅ Updated health check to show service name as "flora-email-service"
   - ✅ Updated package.json name and version
   - ✅ Service version bumped to 2.0.0

---

## Phase 2: Controller Implementation 🚧 TODO

### 2.1 Auth Email Controllers

**File:** `src/controllers/authEmailController.js`

#### sendPasswordResetEmail()
```javascript
// TODO: Implement
// 1. Validate email and resetToken from request
// 2. Render auth/password-reset.html template with:
//    - name, email, resetLink
// 3. Send via Brevo API
// 4. Log email sent event
// 5. Return success response
```

**Template:** `auth/password-reset.html`
**Called by:** Main app `/api/v1/auth/forgot-password`

#### sendEmailVerification()
```javascript
// TODO: Implement
// 1. Validate email and verificationToken
// 2. Render auth/email-verification.html with:
//    - name, email, verificationLink
// 3. Send via Brevo
// 4. Log verification email sent
// 5. Return success
```

**Template:** `auth/email-verification.html`
**Called by:** Main app user registration

#### sendWelcomeEmail()
```javascript
// TODO: Implement
// 1. Validate user data (name, email, role)
// 2. Render auth/welcome.html with:
//    - name, role, loginLink, dashboardLink
// 3. Send via Brevo
// 4. Log welcome email sent
// 5. Return success
```

**Template:** `auth/welcome.html`
**Called by:** Main app after user registration completes

**Estimated Time:** 4-6 hours

---

### 2.2 Capital Call Email Controllers

**File:** `src/controllers/capitalCallEmailController.js`

#### sendCapitalCallNotice()
```javascript
// TODO: Implement
// 1. Validate capitalCallData:
//    - lpEmail, fundName, callAmount, dueDate, wireInstructions
// 2. Render capital-calls/capital-call-notification.html
// 3. Attach capital call PDF if provided
// 4. Send via Brevo with attachments
// 5. Log capital call sent
// 6. Return delivery confirmation
```

**Template:** `capital-calls/capital-call-notification.html`
**Called by:** Main app `capitalCallController.js`

#### sendDistributionNotice()
```javascript
// TODO: Implement
// 1. Validate distribution data
// 2. Render distribution template (or use capital call template variant)
// 3. Send with PDF attachment
// 4. Log distribution sent
// 5. Return success
```

**Template:** Custom or variant of capital-call template
**Called by:** Main app distribution workflows

#### sendBulkCapitalCalls()
```javascript
// TODO: Implement
// 1. Accept array of LP recipients
// 2. Batch process capital call emails
// 3. Rate limit to avoid Brevo limits
// 4. Track successes/failures
// 5. Return bulk send report
```

#### sendCapitalCallReminder()
```javascript
// TODO: Implement
// 1. Validate overdue capital call data
// 2. Render reminder variant
// 3. Send reminder email
// 4. Log reminder sent
// 5. Return success
```

**Estimated Time:** 6-8 hours

---

### 2.3 Document Email Controllers

**File:** `src/controllers/documentEmailController.js`

#### sendDocumentUploadNotification()
```javascript
// TODO: Implement
// 1. Validate document data:
//    - recipientEmail, documentName, uploadedBy, viewLink
// 2. Render documents/document-notification.html
// 3. Send notification
// 4. Log document notification sent
// 5. Return success
```

**Template:** `documents/document-notification.html`
**Called by:** Document upload workflows

#### sendSignatureRequest()
```javascript
// TODO: Implement
// 1. Validate signature request data
// 2. Render signature request variant of document template
// 3. Include signature link
// 4. Send via Brevo
// 5. Log signature request sent
// 6. Return success
```

#### sendSignatureComplete()
```javascript
// TODO: Implement
// 1. Validate completion data
// 2. Render completion notification
// 3. Send to all parties
// 4. Log completion notification
// 5. Return success
```

#### sendSignatureReminder()
```javascript
// TODO: Implement
// 1. Validate pending signature data
// 2. Render reminder
// 3. Send reminder email
// 4. Log reminder sent
// 5. Return success
```

**Estimated Time:** 4-6 hours

---

### 2.4 Invitation Request Email Controllers

**File:** `src/controllers/invitationRequestEmailController.js`

This implements the 5-step invitation request workflow.

#### sendRequestConfirmation()
```javascript
// TODO: Implement
// 1. Validate requester email and request details
// 2. Render invitation-requests/invitation-request-confirmation.html
// 3. Send confirmation to requester
// 4. Log request confirmation sent
// 5. Return success
```

**Template:** `invitation-requests/invitation-request-confirmation.html`
**Workflow Step:** 1 - User submits invitation request

#### sendAdminNotification()
```javascript
// TODO: Implement
// 1. Validate request data for admin review
// 2. Render invitation-requests/invitation-request-admin.html
// 3. Send to admin email(s)
// 4. Include approve/deny links
// 5. Log admin notification sent
// 6. Return success
```

**Template:** `invitation-requests/invitation-request-admin.html`
**Workflow Step:** 2 - Admin notified of new request

#### sendApprovalNotification()
```javascript
// TODO: Implement
// 1. Validate approval data
// 2. Render invitation-requests/invitation-request-approved.html
// 3. Include invitation link
// 4. Send to requester
// 5. Log approval sent
// 6. Return success
```

**Template:** `invitation-requests/invitation-request-approved.html`
**Workflow Step:** 3 - Admin approves request

#### sendDenialNotification()
```javascript
// TODO: Implement
// 1. Validate denial data with reason
// 2. Render invitation-requests/invitation-request-denied.html
// 3. Include denial reason
// 4. Send to requester
// 5. Log denial sent
// 6. Return success
```

**Template:** `invitation-requests/invitation-request-denied.html`
**Workflow Step:** 4 - Admin denies request

#### sendFollowupReminder()
```javascript
// TODO: Implement
// 1. Validate pending request data
// 2. Render invitation-requests/invitation-request-followup.html
// 3. Send reminder to admin or requester
// 4. Log followup sent
// 5. Return success
```

**Template:** `invitation-requests/invitation-request-followup.html`
**Workflow Step:** 5 - Follow-up on pending requests

**Estimated Time:** 5-7 hours

---

### 2.5 System Email Controllers

**File:** `src/controllers/systemEmailController.js`

#### sendMaintenanceNotification()
```javascript
// TODO: Implement
// 1. Validate maintenance window data
// 2. Render system/system-maintenance.html
// 3. Get all active user emails
// 4. Batch send to all users
// 5. Log maintenance notification sent
// 6. Return bulk send report
```

**Template:** `system/system-maintenance.html`
**Called by:** Admin system notifications

#### sendAnnouncement()
```javascript
// TODO: Implement
// 1. Validate announcement data
// 2. Render announcement template
// 3. Batch send to target users
// 4. Log announcement sent
// 5. Return bulk send report
```

#### sendBulkEmails()
```javascript
// TODO: Implement
// 1. Validate recipients array and template
// 2. Batch process with rate limiting
// 3. Track individual send results
// 4. Log bulk send operation
// 5. Return detailed report
```

**Estimated Time:** 3-4 hours

---

## Phase 3: Email Service Expansion 🚧 TODO

### 3.1 Expand Core Email Service

**File:** `src/services/emailService.js`

**Current State:** Basic Brevo integration for invitations only

**Needed Expansions:**

1. **Add Template Rendering for All Types**
   ```javascript
   async renderAuthEmail(templateName, data) {
     // Render auth templates
   }

   async renderCapitalCallEmail(data) {
     // Render capital call template
   }

   async renderDocumentEmail(data) {
     // Render document template
   }

   async renderInvitationRequestEmail(templateName, data) {
     // Render invitation request templates
   }

   async renderSystemEmail(templateName, data) {
     // Render system templates
   }
   ```

2. **Add Attachment Support**
   ```javascript
   async sendEmailWithAttachments(emailData, attachments) {
     // Handle PDF attachments for capital calls, documents
   }
   ```

3. **Add Bulk Send with Rate Limiting**
   ```javascript
   async sendBulkWithRateLimit(recipients, templateData, options) {
     // Batch processing with Brevo rate limits
     // Progress tracking
     // Error handling per recipient
   }
   ```

4. **Add Email Tracking**
   ```javascript
   async trackEmailSent(emailId, type, recipient, metadata) {
     // Store email send events in MongoDB
   }

   async getEmailDeliveryStatus(emailId) {
     // Query Brevo for delivery status
   }
   ```

**Estimated Time:** 4-6 hours

---

### 3.2 Create Email Models

**File:** `src/models/EmailLog.js` (NEW)

```javascript
// Track all email sends for audit/troubleshooting
const EmailLogSchema = new Schema({
  emailType: String,  // 'password-reset', 'capital-call', etc.
  recipient: String,
  subject: String,
  templateUsed: String,
  brevoMessageId: String,
  sentAt: Date,
  deliveryStatus: String,  // 'sent', 'delivered', 'bounced', 'failed'
  metadata: Mixed,
  retries: Number
});
```

**Estimated Time:** 2 hours

---

## Phase 4: Main App Integration 🚧 TODO

### 4.1 Update Main App Proxy Routes

**File:** `/routes/v1/emails-proxy.js` (NEW in main app)

Create comprehensive proxy to route ALL email requests to email service:

```javascript
// Auth emails
router.post('/auth/password-reset', proxyToEmailService);
router.post('/auth/email-verification', proxyToEmailService);
router.post('/auth/welcome', proxyToEmailService);

// Capital call emails
router.post('/capital-calls/send', proxyToEmailService);
router.post('/capital-calls/distribution', proxyToEmailService);
router.post('/capital-calls/bulk', proxyToEmailService);

// Document emails
router.post('/documents/upload-notification', proxyToEmailService);
router.post('/documents/signature-request', proxyToEmailService);

// Invitation request emails
router.post('/invitation-requests/confirmation', proxyToEmailService);
router.post('/invitation-requests/admin-notification', proxyToEmailService);
router.post('/invitation-requests/approved', proxyToEmailService);
router.post('/invitation-requests/denied', proxyToEmailService);

// System emails
router.post('/system/maintenance', proxyToEmailService);
router.post('/system/announcement', proxyToEmailService);
```

**Estimated Time:** 2-3 hours

---

### 4.2 Update Existing Controllers

**Files to Update:**

1. `/routes/v1/auth.js`
   - Line 500: Replace `emailService.sendTemplateEmail()` with proxy call

2. `/controllers/capitalCallController.js`
   - Replace `emailService.sendCapitalCallNotice()` with proxy call

3. Document controllers
   - Replace document email calls with proxy calls

4. Invitation request workflows
   - Replace all 5 workflow email calls with proxy calls

**Estimated Time:** 3-4 hours

---

## Phase 5: Testing 🚧 TODO

### 5.1 Unit Tests

Create tests for each controller method:
- Auth email controllers (4 tests)
- Capital call controllers (4 tests)
- Document controllers (4 tests)
- Invitation request controllers (5 tests)
- System controllers (3 tests)

**Estimated Time:** 4-6 hours

---

### 5.2 Integration Tests

Test complete flows end-to-end:
1. Password reset flow
2. Email verification flow
3. Welcome email flow
4. Capital call notification flow
5. Document signature request flow
6. Invitation request 5-step workflow
7. System maintenance notification

**Estimated Time:** 4-6 hours

---

### 5.3 Manual Testing

Test in staging environment:
- Send test emails for each type
- Verify Brevo delivery
- Check email rendering
- Test bulk sends
- Verify rate limiting
- Check email logs

**Estimated Time:** 3-4 hours

---

## Phase 6: Deployment & Monitoring 🚧 TODO

### 6.1 Railway Configuration

1. **Service Rename**
   - Railway dashboard: Rename service to `flora-email-service`
   - Update service description

2. **Environment Variables**
   - Already configured ✅
   - Add any new variables for expanded functionality

3. **Database Connection**
   - Fix MongoDB connection (currently pending)
   - Verify shared `venturestudio` database access

**Estimated Time:** 1-2 hours

---

### 6.2 GitHub Repository Rename

1. Rename repo: `flora-invitations-service` → `flora-email-service`
2. Update all repository references
3. Update submodule in main repo
4. Update README and documentation

**Estimated Time:** 1 hour

---

### 6.3 Main App Deployment

1. Deploy proxy routes
2. Update environment variables
3. Test all email flows in production
4. Monitor error logs
5. Verify Brevo delivery rates

**Estimated Time:** 2-3 hours

---

## Total Estimated Time

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Phase 1: Structure | ✅ Complete | 0 hours |
| Phase 2: Controllers | 5 controller implementations | 22-31 hours |
| Phase 3: Email Service | Service expansion + models | 6-8 hours |
| Phase 4: Main App | Proxy routes + controller updates | 5-7 hours |
| Phase 5: Testing | Unit + integration + manual | 11-16 hours |
| Phase 6: Deployment | Railway + GitHub + production | 4-6 hours |
| **TOTAL** | **All phases** | **48-68 hours** |

**Realistic Timeline:** 1-2 weeks of focused development

---

## Current Status Summary

**✅ Completed (15%):**
- All templates copied and organized
- All route files created
- All controller placeholders created
- Server.js updated with all routes
- Package.json updated to flora-email-service
- Service structure complete

**🚧 In Progress (0%):**
- None currently

**📋 TODO (85%):**
- Controller implementations (22-31 hours)
- Email service expansion (6-8 hours)
- Main app integration (5-7 hours)
- Testing (11-16 hours)
- Deployment (4-6 hours)

---

## Next Immediate Steps

1. **Fix MongoDB Connection** (blocking)
   - Current issue: Database not connecting
   - Required: Verify shared `venturestudio` database access

2. **Implement Auth Email Controllers** (first priority)
   - Password reset (most critical)
   - Email verification
   - Welcome email

3. **Test Auth Email Flow**
   - End-to-end password reset
   - Verify email delivery

4. **Implement Capital Call Controllers** (second priority)
   - Critical for GP operations

5. **Continue with remaining controllers**
   - Documents, invitation requests, system emails

---

**Status:** Ready for phased implementation. Structure is complete, awaiting development of controller logic and email service methods.
