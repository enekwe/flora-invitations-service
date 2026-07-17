# Flora Invitations Service - Railway Environment Variables

## Quick Setup via Railway Dashboard

Since you've already deployed the `flora-invitations-service` to Railway, configure these environment variables in the Railway dashboard:

### Navigate To:
Railway Dashboard → flora-invitations-service → Variables tab

---

## Required Environment Variables

### 1. Node Configuration
```bash
NODE_ENV=production
PORT=3016
```

### 2. Database
**Option A: Shared MongoDB (Recommended for now)**
```bash
# Use the same MongoDB as main app, different database name
MONGODB_URI=<copy-from-passbook-flora-service>/flora_invitations?authSource=admin
```

**Option B: Dedicated MongoDB**
```bash
# Create new MongoDB service in Railway, then use its MONGO_URL
MONGODB_URI=<new-mongodb-service-url>
```

### 3. JWT Authentication (MUST match main app)
```bash
# Copy from passbook-flora service
JWT_SECRET=<same-as-main-app>
JWT_EXPIRES_IN=7d
```

### 4. Brevo Email Service
```bash
# Copy from passbook-flora service
BREVO_API_KEY=<same-as-main-app>
BREVO_API_URL=https://api.brevo.com/v3
BREVO_SENDER_EMAIL=flora@passbook.vc
BREVO_SENDER_NAME=Passbook Flora
```

### 5. Frontend URL
```bash
FRONTEND_URL=https://flora.passbook.vc
```

### 6. Main App Communication
```bash
# Main app Railway URL
MAIN_APP_API_URL=https://api.flora.passbook.vc

# Generated secure API key (use the one below)
MAIN_APP_API_KEY=3aa74dbdfeb1fc1426978d48e3d88c8c806b8d7f00758b47d1c48a978455b27f
```

### 7. Service Configuration
```bash
MAX_INVITATIONS_PER_HOUR=100
TOKEN_EXPIRATION_DAYS=7
ENABLE_AUDIT_LOGGING=true
LOG_LEVEL=info
```

---

## Update Main App (passbook-flora service)

In Railway Dashboard → passbook-flora → Variables tab, add:

```bash
# Get the URL from flora-invitations-service → Settings → Domains
INVITATIONS_SERVICE_URL=https://flora-invitations-service-production.up.railway.app

# Same API key as above (for bidirectional auth)
INVITATIONS_SERVICE_API_KEY=3aa74dbdfeb1fc1426978d48e3d88c8c806b8d7f00758b47d1c48a978455b27f
```

**Note:** Replace `https://flora-invitations-service-production.up.railway.app` with your actual Railway-generated URL from the Domains tab.

---

## Environment Variable Checklist

### flora-invitations-service
- [ ] NODE_ENV=production
- [ ] PORT=3016
- [ ] MONGODB_URI (from existing MongoDB or new service)
- [ ] JWT_SECRET (copied from passbook-flora)
- [ ] JWT_EXPIRES_IN=7d
- [ ] BREVO_API_KEY (copied from passbook-flora)
- [ ] BREVO_API_URL=https://api.brevo.com/v3
- [ ] BREVO_SENDER_EMAIL=flora@passbook.vc
- [ ] BREVO_SENDER_NAME=Passbook Flora
- [ ] FRONTEND_URL=https://flora.passbook.vc
- [ ] MAIN_APP_API_URL=https://api.flora.passbook.vc
- [ ] MAIN_APP_API_KEY=3aa74dbdfeb1fc1426978d48e3d88c8c806b8d7f00758b47d1c48a978455b27f
- [ ] MAX_INVITATIONS_PER_HOUR=100
- [ ] TOKEN_EXPIRATION_DAYS=7
- [ ] ENABLE_AUDIT_LOGGING=true
- [ ] LOG_LEVEL=info

### passbook-flora (main app)
- [ ] INVITATIONS_SERVICE_URL=<your-railway-url>
- [ ] INVITATIONS_SERVICE_API_KEY=3aa74dbdfeb1fc1426978d48e3d88c8c806b8d7f00758b47d1c48a978455b27f

---

## How to Copy Values from passbook-flora

### Via Railway Dashboard:
1. Go to passbook-flora service → Variables tab
2. Click "Copy" icon next to each variable
3. Paste into flora-invitations-service → Variables tab

### Via Railway CLI (if interactive):
```bash
# Get JWT_SECRET from main app
railway variables --service passbook-flora | grep JWT_SECRET

# Get BREVO_API_KEY from main app
railway variables --service passbook-flora | grep BREVO_API_KEY

# Get MONGODB_URI from main app
railway variables --service passbook-flora | grep MONGODB_URI
```

---

## MongoDB Setup Options

### Recommended: Use Existing MongoDB (Shared Instance)

**Pros:**
- No additional cost
- Simpler setup
- Data isolation via database name

**Steps:**
1. Copy `MONGODB_URI` from passbook-flora service
2. Change the database name from `venturestudio` to `flora_invitations`
3. Example:
   ```
   Original: mongodb://user:pass@host:port/venturestudio?authSource=admin
   Updated:  mongodb://user:pass@host:port/flora_invitations?authSource=admin
   ```

### Alternative: Create New MongoDB Service

**Pros:**
- Complete isolation
- Independent scaling
- Easier data management

**Steps:**
1. In Railway dashboard: + New → Database → MongoDB
2. Name it: `flora-invitations-db`
3. Wait for provisioning
4. Go to Variables tab
5. Copy `MONGO_URL` value
6. Use as `MONGODB_URI` in flora-invitations-service

---

## Verification Steps

### 1. Check Service Health
```bash
curl https://flora-invitations-service-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "flora-invitations-service",
  "database": "connected",
  "uptime": 123
}
```

### 2. Check Railway Logs
Railway Dashboard → flora-invitations-service → Deployments → View Logs

Look for:
```
✅ Database connected successfully
✅ Server running on port 3016
✅ Health check endpoint available
```

### 3. Test from Main App
```bash
# Should proxy to invitations service
curl -X GET https://api.flora.passbook.vc/api/v1/admin/invitations \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Troubleshooting

### Database Connection Failed
**Error:** `MongooseServerSelectionError`

**Solution:**
- Verify `MONGODB_URI` is in TCP proxy format (not `.railway.internal`)
- Check MongoDB service is running
- Verify credentials in connection string

### Email Not Sending
**Error:** `Brevo API error: Unauthorized`

**Solution:**
- Verify `BREVO_API_KEY` matches main app
- Check Brevo account is active
- Verify sender email is verified in Brevo

### Main App Cannot Reach Invitations Service
**Error:** `ECONNREFUSED` or `503 Service Unavailable`

**Solution:**
- Verify `INVITATIONS_SERVICE_URL` is correct in passbook-flora
- Check flora-invitations-service deployment is running
- Verify `INVITATIONS_SERVICE_API_KEY` matches in both services

### Context Resolution Failed
**Error:** `Failed to fetch fund context`

**Solution:**
- Verify `MAIN_APP_API_URL` points to correct URL
- Verify `MAIN_APP_API_KEY` matches in both services
- Check internal API routes are deployed in main app

---

## Security Notes

- **API Key**: The API key `3aa74dbdfeb1fc1426978d48e3d88c8c806b8d7f00758b47d1c48a978455b27f` is used for service-to-service authentication
- **JWT Secret**: Must be identical in both services for token validation
- **Brevo API Key**: Shared for email sending consistency
- **MongoDB**: Can be shared (different databases) or separate instances

---

## Next Steps After Configuration

1. ✅ All environment variables set
2. ✅ Service deployed and healthy
3. ✅ Main app updated with invitations service URL
4. ⏭️ Test invitation creation from admin dashboard
5. ⏭️ Verify email delivery via Brevo
6. ⏭️ Test invitation acceptance flow
7. ⏭️ Monitor logs for any errors

For detailed testing procedures, see `DEPLOYMENT_INSTRUCTIONS.md`.
