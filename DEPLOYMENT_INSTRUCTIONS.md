# Flora Invitations Service - Deployment Instructions

## Overview

The Flora Invitations Service is now ready for deployment! This document provides step-by-step instructions for deploying the microservice to Railway and integrating it with the main Passbook Flora application.

## What Was Built

### Microservice Components
- ✅ Complete microservice infrastructure (Routes → Controllers → Services → Models)
- ✅ Sender context resolution (GP fund, LP person/institution, Founder company, Admin)
- ✅ 7 context-aware email templates
- ✅ Enhanced PlatformInvitation model with `senderContext` fields
- ✅ Brevo email integration with retry logic
- ✅ Template selection algorithm based on sender context
- ✅ RBAC enforcement for all endpoints
- ✅ Comprehensive audit logging
- ✅ Integration tests
- ✅ Docker and Railway deployment configs

### Main App Integration
- ✅ Proxy routes in main app (`/routes/v1/invitations-proxy.js`)
- ✅ Internal API endpoints for user creation and context resolution (`/routes/v1/internal-api.js`)
- ✅ Environment variables in `.env.example`
- ✅ Git submodule configuration in `.gitmodules`
- ✅ Deprecated old invitation routes

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/enekwe (or your GitHub organization)
2. Click "New repository"
3. Name: `flora-invitations-service`
4. Description: "Dedicated microservice for Flora invitation workflows with context-aware email templates"
5. **Do NOT initialize with README** (we already have one)
6. Click "Create repository"

## Step 2: Push Microservice to GitHub

```bash
cd /Users/cope/Passbook_Oracle/microservices/flora-invitations-service

# Add the GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/enekwe/flora-invitations-service.git

# Push to GitHub
git push -u origin main
```

## Step 3: Update Main App Submodule

```bash
cd /Users/cope/Passbook_Oracle

# Initialize the submodule
git submodule init microservices/flora-invitations-service

# Update .gitmodules was already done - now sync
git submodule sync

# Add and commit the submodule reference
git add microservices/flora-invitations-service
git commit -m "chore: add flora-invitations-service submodule

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push main repo
git push origin main
```

## Step 4: Create MongoDB Database on Railway

1. Go to your Railway dashboard
2. Create a new database:
   - Click "+ New"
   - Select "Database"
   - Choose "MongoDB"
   - Name it: `flora-invitations-db`

3. Get the connection details:
   - Click on the MongoDB service
   - Go to "Variables" tab
   - Copy the `MONGO_URL` value (should be TCP proxy format)

4. **Important**: Ensure the URL format is:
   ```
   mongodb://username:password@mongodbproxy.railway.internal:PORT/flora_invitations?authSource=admin
   ```
   NOT `.railway.internal` format!

## Step 5: Deploy Microservice to Railway

1. In Railway dashboard, click "+ New"
2. Select "GitHub Repo"
3. Connect to `flora-invitations-service` repository
4. Railway will detect the Dockerfile and deploy automatically

### Configure Environment Variables

Add these environment variables in Railway dashboard for the invitations service:

```bash
# Node Environment
NODE_ENV=production
PORT=3016

# Database (use the MongoDB URL from Step 4)
MONGODB_URI=<your-mongodb-tcp-proxy-url>

# JWT Secret (MUST match main app)
JWT_SECRET=<same-as-main-app>
JWT_EXPIRES_IN=7d

# Brevo Email
BREVO_API_KEY=<your-brevo-api-key>
BREVO_API_URL=https://api.brevo.com/v3
BREVO_SENDER_EMAIL=flora@passbook.vc
BREVO_SENDER_NAME=Passbook Flora

# Frontend URL
FRONTEND_URL=https://flora.passbook.vc

# Main App API (for context resolution)
MAIN_APP_API_URL=<your-main-app-railway-url>
MAIN_APP_API_KEY=<generate-secure-api-key>

# Service Configuration
MAX_INVITATIONS_PER_HOUR=100
TOKEN_EXPIRATION_DAYS=7
ENABLE_AUDIT_LOGGING=true

# Logging
LOG_LEVEL=info
```

### Generate Secure API Key

```bash
# Generate a secure API key for internal service-to-service communication
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use this same API key in both:
- `MAIN_APP_API_KEY` in flora-invitations-service
- `INVITATIONS_SERVICE_API_KEY` in main Passbook Flora app

## Step 6: Update Main App Environment Variables

In Railway dashboard for the main Passbook Flora app, add:

```bash
# Flora Invitations Microservice
INVITATIONS_SERVICE_URL=<railway-url-from-step-5>
INVITATIONS_SERVICE_API_KEY=<same-api-key-from-step-5>
```

Example:
```bash
INVITATIONS_SERVICE_URL=https://flora-invitations-service.up.railway.app
INVITATIONS_SERVICE_API_KEY=a1b2c3d4e5f6...
```

## Step 7: Verify Deployment

### Test Health Endpoint

```bash
curl https://flora-invitations-service.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "flora-invitations-service",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "database": "connected",
  "uptime": 123
}
```

### Test Internal API from Main App

```bash
# Test fund context resolution
curl -H "X-API-Key: your-api-key" \
  https://your-main-app.railway.app/api/v1/internal/context/fund/FUND_ID
```

## Step 8: Test End-to-End Invitation Flow

### From Admin Dashboard

1. Log in to Flora as admin
2. Navigate to Admin Dashboard → Manage Invitations
3. Click "Create Invitation"
4. Fill in:
   - Email: test@example.com
   - Role: LP
   - Fund: Select a fund
5. Click "Send Invitation"
6. Check logs in Railway for both services

### Verify Email Sent

1. Check Brevo dashboard for sent emails
2. Verify template used matches role (e.g., `lp-invitation.html`)
3. Verify sender context is correctly resolved (fund name shown)

### Test Invitation Acceptance

1. Open the invitation link from email
2. Fill in user details and accept
3. Verify user created in main app database
4. Verify stakeholder record created (for GP/LP roles)

## Step 9: Monitor and Debug

### Railway Logs

Monitor both services for errors:

**Invitations Service:**
```bash
# In Railway dashboard
Service: flora-invitations-service → Deployments → View Logs
```

Look for:
- Database connection success
- Email sending success
- Context resolution API calls
- Any errors or warnings

**Main App:**
```bash
# In Railway dashboard
Service: passbook-flora → Deployments → View Logs
```

Look for:
- Proxy requests to invitations service
- Internal API calls from invitations service
- User creation from invitations

### Common Issues

#### 1. Database Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Verify `MONGODB_URI` uses TCP proxy format (NOT `.railway.internal`)
- Check MongoDB service is running in Railway
- Verify credentials in connection string

#### 2. Email Not Sending

**Error:** `Brevo API error: Unauthorized`

**Solution:**
- Verify `BREVO_API_KEY` is correct
- Check Brevo account is active
- Verify sender email is verified in Brevo

#### 3. Context Resolution Failed

**Error:** `Failed to fetch fund context`

**Solution:**
- Verify `MAIN_APP_API_URL` points to correct Railway URL
- Verify `MAIN_APP_API_KEY` matches in both services
- Check internal API routes are registered in main app

#### 4. Template Not Found

**Error:** `Email template "gp-invitation.html" not found`

**Solution:**
- Verify all template files are in `src/templates/emails/` directory
- Check Dockerfile copies template files correctly
- Rebuild and redeploy service

## Step 10: Data Migration (Optional)

If you have existing invitations in the main app database, run the migration script:

```bash
# This will be provided in a separate migration guide
# For now, new invitations will use the microservice
# Old invitations remain in main app database (read-only)
```

## Step 11: Upload Templates to Brevo (Optional)

If you prefer using Brevo's template engine instead of HTML files:

1. Go to Brevo Dashboard → Campaigns → Templates
2. Create new template for each invitation type
3. Copy HTML from `src/templates/emails/*.html`
4. Note the template ID for each
5. Add to Railway environment variables:
   ```bash
   BREVO_GP_TEMPLATE_ID=1
   BREVO_LP_TEMPLATE_ID=2
   BREVO_FOUNDER_TEMPLATE_ID=3
   BREVO_ADMIN_FUND_TEMPLATE_ID=4
   BREVO_ADMIN_GENERIC_TEMPLATE_ID=5
   BREVO_INVESTMENT_TEMPLATE_ID=6
   ```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Vercel)                        │
│              flora.passbook.vc                               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Main Passbook Flora App (Railway)               │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Proxy Routes (/api/v1/*)                     │   │
│  │  - /admin/invitations                                │   │
│  │  - /investment-invitations                           │   │
│  │  - /invite/accept                                    │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ Forward to microservice                │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │      Internal API (/api/v1/internal/*)               │   │
│  │  - POST /users/create-from-invitation                │   │
│  │  - GET /context/fund/:id                             │   │
│  │  - GET /context/company/:id                          │   │
│  │  - GET /context/lp/:id                               │   │
│  │  - GET /context/gp/:id                               │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Service-to-Service (API Key Auth)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│        Flora Invitations Service (Railway)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/v1/invitations/*)                  │   │
│  │  - POST /create                                      │   │
│  │  - GET / (list)                                      │   │
│  │  - GET /:id                                          │   │
│  │  - PATCH /:id/resend                                 │   │
│  │  - PATCH /:id/revoke                                 │   │
│  │  - POST /accept/:token                               │   │
│  │  - GET /stats                                        │   │
│  └────────┬─────────────────────────────────────────────┘   │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Context Service                                     │   │
│  │  - Calls main app internal API for fund/company     │   │
│  │  - Resolves sender context (GP/LP/Founder/Admin)    │   │
│  │  - Caches results for 5 minutes                      │   │
│  └────────┬─────────────────────────────────────────────┘   │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Template Service                                    │   │
│  │  - Selects template based on sender context         │   │
│  │  - Renders with Handlebars                          │   │
│  │  - 7 context-aware templates                        │   │
│  └────────┬─────────────────────────────────────────────┘   │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Email Service                                       │   │
│  │  - Sends via Brevo API                              │   │
│  │  - Retry logic (3 attempts)                         │   │
│  │  - Tracks deliverability                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Database: flora_invitations (MongoDB)                       │
└─────────────────────────────────────────────────────────────┘
```

## Success Criteria

✅ All checklist items completed when:

1. Microservice deployed to Railway and health check passes
2. MongoDB database created and connected
3. Main app can proxy requests to microservice
4. Internal API endpoints responding
5. GP invitation shows correct fund name in email
6. LP invitation shows correct LP name/entity in email
7. Portfolio Founder invitation shows correct company name
8. Admin invitations work for both fund-specific and generic
9. Invitation acceptance creates user in main app database
10. All invitation types tested end-to-end

## Rollback Plan

If issues arise, you can temporarily revert:

1. In main app `app.js`, uncomment old routes:
   ```javascript
   const adminInvitationsRoutes = require('./routes/v1/admin-invitations');
   const investmentInvitationsRoutes = require('./routes/v1/investment-invitations');
   ```

2. Re-enable route registrations:
   ```javascript
   app.use('/api/v1/admin', adminInvitationsRoutes);
   app.use('/api/v1/investments/invitations', authMiddleware, investmentInvitationsRoutes);
   ```

3. Comment out proxy routes temporarily

4. Redeploy main app

## Next Steps After Deployment

1. **Performance Monitoring**
   - Set up error tracking (Sentry)
   - Monitor invitation acceptance rates
   - Track email delivery rates
   - Monitor API latency

2. **Data Migration**
   - Migrate existing invitations from main app to microservice
   - Verify data integrity
   - Update invitation IDs if needed

3. **Cleanup**
   - Remove deprecated routes from main app after migration
   - Remove old PlatformInvitation model from main app
   - Archive old invitation-related code

4. **Enhancements**
   - Add bulk invitation import
   - Add invitation analytics dashboard
   - Implement email preview feature
   - Add webhook support for email delivery status

---

## Support

If you encounter issues during deployment:

1. Check Railway logs for both services
2. Verify environment variables are set correctly
3. Test each component individually (database, API endpoints, email service)
4. Review this document for troubleshooting tips

**Documentation:**
- README.md - Complete project documentation
- DEPLOYMENT_CHECKLIST.md - Detailed deployment steps
- src/templates/emails/README.md - Template documentation

**Contact:** support@passbook.vc
