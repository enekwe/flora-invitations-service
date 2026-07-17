# Flora Email Service - Quick Deploy Reference

**Status:** Ready for Railway Deployment
**Time Required:** 45 minutes

---

## 1. Push to GitHub (5 min)

```bash
# Push submodule
cd /Users/cope/Passbook_Oracle/microservices/flora-email-service
git push origin main

# Push parent repo
cd /Users/cope/Passbook_Oracle
git push origin main
```

---

## 2. Create Railway Service (5 min)

### Via Dashboard
1. Go to https://railway.app → passbook-flora project
2. Click **+ New Service** → **GitHub Repo**
3. Select: `flora-email-service`
4. Name: `flora-email-service-production`

### Via CLI
```bash
cd /Users/cope/Passbook_Oracle/microservices/flora-email-service
railway login
railway link  # Select passbook-flora
railway service create flora-email-service-production
```

---

## 3. Set Environment Variables (10 min)

### Get Values from Main App
```bash
railway variables --service passbook-flora | grep -E "MONGODB_URI|JWT_SECRET|BREVO_API_KEY|INVITATIONS_SERVICE_API_KEY"
```

### Set in New Service
Railway Dashboard → flora-email-service-production → Variables → **Raw Editor**

```env
NODE_ENV=production
PORT=3016
SERVICE_NAME=flora-email-service
LOG_LEVEL=info
ENABLE_AUDIT_LOGGING=true

# CRITICAL - Copy from passbook-flora:
MONGODB_URI=<paste-here>
JWT_SECRET=<paste-here>
JWT_EXPIRES_IN=7d
BREVO_API_KEY=<paste-here>
BREVO_API_URL=https://api.brevo.com/v3
BREVO_SENDER_EMAIL=flora@passbook.vc
BREVO_SENDER_NAME=Passbook Flora
MAIN_APP_API_KEY=<paste-INVITATIONS_SERVICE_API_KEY-here>

# Standard:
FRONTEND_URL=https://flora.passbook.vc
MAIN_APP_API_URL=https://api.flora.passbook.vc
MAX_INVITATIONS_PER_HOUR=100
TOKEN_EXPIRATION_DAYS=7
ALLOWED_ORIGINS=https://flora.passbook.vc,https://api.flora.passbook.vc

# Features:
ENABLE_INVITATION_EMAILS=true
ENABLE_AUTH_EMAILS=true
ENABLE_CAPITAL_CALL_EMAILS=true
ENABLE_DOCUMENT_EMAILS=true
ENABLE_NOTIFICATION_EMAILS=true
```

Click **Update Variables** → Triggers automatic deployment

---

## 4. Monitor Deployment (5 min)

```bash
railway logs --service flora-email-service-production --tail
```

### Expected Logs
```
✅ Server starting on port 3016
✅ MongoDB connected successfully
✅ Email service initialized with Brevo
✅ Server running on port 3016 in production mode
```

---

## 5. Verify Deployment (10 min)

### Health Check
```bash
curl https://flora-email-service-production.up.railway.app/health
```

**Expected:**
```json
{
  "success": true,
  "service": "flora-email-service",
  "version": "2.0.0",
  "database": "connected",
  "environment": "production"
}
```

### Test Invitation Email
```bash
curl -X POST https://flora-email-service-production.up.railway.app/api/v1/invitations/create \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_MAIN_APP_API_KEY" \
  -d '{
    "email": "test@example.com",
    "role": "LP",
    "inviterName": "Test User",
    "fundName": "Test Fund",
    "personalMessage": "Test"
  }'
```

### Test Password Reset
```bash
curl -X POST https://flora-email-service-production.up.railway.app/api/v1/auth-emails/password-reset \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_MAIN_APP_API_KEY" \
  -d '{
    "email": "test@example.com",
    "resetToken": "test-token"
  }'
```

---

## 6. Update Main App (5 min)

Railway Dashboard → **passbook-flora** → Variables

### Add (keep old for rollback):
```env
EMAIL_SERVICE_URL=https://flora-email-service-production.up.railway.app
EMAIL_SERVICE_API_KEY=<same-as-INVITATIONS_SERVICE_API_KEY>
```

### Keep for 48 hours:
```env
INVITATIONS_SERVICE_URL=https://flora-invitations-service-production.up.railway.app
INVITATIONS_SERVICE_API_KEY=<current-value>
```

---

## 7. Verify Integration (5 min)

```bash
# Test main app can reach new service
curl -X GET https://api.flora.passbook.vc/api/v1/admin/invitations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 8. Monitor (24 hours)

### Watch Logs
```bash
railway logs --service flora-email-service-production --tail
```

### Check Metrics
- Response times < 1s
- Error rate < 0.1%
- CPU < 70%
- Memory < 80%

### Brevo Dashboard
- Email delivery rate > 95%
- Bounce rate < 2%

---

## Quick Rollback (if needed)

```bash
# 1. Switch main app back
# Railway Dashboard → passbook-flora → Variables
EMAIL_SERVICE_URL=https://flora-invitations-service-production.up.railway.app

# 2. Stop new service
railway service stop --service flora-email-service-production

# 3. Verify old service
curl https://flora-invitations-service-production.up.railway.app/health
```

---

## Troubleshooting

### Service Won't Start
```bash
railway logs --service flora-email-service-production | grep ERROR
```
→ Check MONGODB_URI, BREVO_API_KEY

### Database Disconnected
→ Verify MONGODB_URI format:
```
mongodb://user:pass@host:port/database?authSource=admin
```

### Emails Not Sending
→ Check BREVO_API_KEY matches main app
→ Verify sender email in Brevo dashboard

---

## Documentation

- **Full Plan:** `/Users/cope/Passbook_Oracle/DEPLOYMENT_PLAN.md`
- **Railway Guide:** `/Users/cope/Passbook_Oracle/microservices/flora-email-service/RAILWAY_DEPLOYMENT_GUIDE.md`
- **Final Status:** `/Users/cope/Passbook_Oracle/FLORA_EMAIL_SERVICE_FINAL_STATUS.md`
- **Env Template:** `.env.production.template`

---

**Ready to Deploy!**
Start with step 1 above.
