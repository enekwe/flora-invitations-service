#!/bin/bash

# Flora Invitations Service - Railway Configuration Script
# Run this after deploying the service to Railway

set -e

echo "🚀 Flora Invitations Service - Railway Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generated API Key for internal service communication
API_KEY="3aa74dbdfeb1fc1426978d48e3d88c8c806b8d7f00758b47d1c48a978455b27f"

echo -e "${YELLOW}Step 1: Verify you're in the correct service${NC}"
echo "Run: railway status"
echo "Expected: Service should be 'flora-invitations-service'"
echo ""
read -p "Press Enter to continue..."

echo -e "${YELLOW}Step 2: Setting Environment Variables${NC}"
echo ""

# Get values from main app (these should match main passbook-flora service)
JWT_SECRET=$(railway variables --service passbook-flora 2>/dev/null | grep "JWT_SECRET" | awk '{print $3}' || echo "NEED_TO_SET")
BREVO_API_KEY=$(railway variables --service passbook-flora 2>/dev/null | grep "BREVO_API_KEY" | awk '{print $3}' || echo "NEED_TO_SET")
MONGODB_URI_BASE=$(railway variables --service passbook-flora 2>/dev/null | grep "MONGODB_URI" | awk '{print $3}' || echo "NEED_TO_SET")

echo "Setting NODE_ENV=production..."
railway variables --set NODE_ENV=production

echo "Setting PORT=3016..."
railway variables --set PORT=3016

echo "Setting JWT_SECRET (from main app)..."
railway variables --set JWT_SECRET="$JWT_SECRET"

echo "Setting JWT_EXPIRES_IN=7d..."
railway variables --set JWT_EXPIRES_IN=7d

echo "Setting BREVO_API_KEY (from main app)..."
railway variables --set BREVO_API_KEY="$BREVO_API_KEY"

echo "Setting BREVO_API_URL..."
railway variables --set BREVO_API_URL=https://api.brevo.com/v3

echo "Setting BREVO_SENDER_EMAIL..."
railway variables --set BREVO_SENDER_EMAIL=flora@passbook.vc

echo "Setting BREVO_SENDER_NAME..."
railway variables --set BREVO_SENDER_NAME="Passbook Flora"

echo "Setting FRONTEND_URL..."
railway variables --set FRONTEND_URL=https://flora.passbook.vc

echo "Setting MAIN_APP_API_URL..."
railway variables --set MAIN_APP_API_URL=https://api.flora.passbook.vc

echo "Setting MAIN_APP_API_KEY..."
railway variables --set MAIN_APP_API_KEY="$API_KEY"

echo "Setting MAX_INVITATIONS_PER_HOUR..."
railway variables --set MAX_INVITATIONS_PER_HOUR=100

echo "Setting TOKEN_EXPIRATION_DAYS..."
railway variables --set TOKEN_EXPIRATION_DAYS=7

echo "Setting ENABLE_AUDIT_LOGGING..."
railway variables --set ENABLE_AUDIT_LOGGING=true

echo "Setting LOG_LEVEL..."
railway variables --set LOG_LEVEL=info

echo ""
echo -e "${GREEN}✅ Environment variables configured!${NC}"
echo ""

echo -e "${YELLOW}Step 3: Set MongoDB URI${NC}"
echo "You need to manually set MONGODB_URI to your Railway MongoDB instance"
echo ""
echo "Option 1: Use existing MongoDB from main app (shared database)"
echo "  railway variables --set MONGODB_URI=\"\$MONGODB_URI_BASE/flora_invitations?authSource=admin\""
echo ""
echo "Option 2: Create new MongoDB service for invitations"
echo "  1. In Railway dashboard: + New → Database → MongoDB"
echo "  2. Name it: flora-invitations-db"
echo "  3. Get MONGO_URL from Variables tab"
echo "  4. Run: railway variables --set MONGODB_URI=\"<your-mongo-url>\""
echo ""
read -p "Press Enter after setting MONGODB_URI..."

echo ""
echo -e "${YELLOW}Step 4: Update Main App with Invitations Service URL${NC}"
echo ""
echo "Getting invitations service URL..."
INVITATIONS_URL=$(railway domain 2>/dev/null | grep "https://" | awk '{print $2}' || echo "MANUAL_CHECK_NEEDED")

if [ "$INVITATIONS_URL" == "MANUAL_CHECK_NEEDED" ]; then
    echo "Could not auto-detect URL. Please run:"
    echo "  railway domain"
    echo "And note the URL (e.g., https://flora-invitations-service.up.railway.app)"
    read -p "Enter the invitations service URL: " INVITATIONS_URL
fi

echo ""
echo "Now updating main passbook-flora service with invitations URL..."
echo ""

# Switch to main app and set variables
echo "Setting INVITATIONS_SERVICE_URL in main app..."
railway variables --service passbook-flora --set INVITATIONS_SERVICE_URL="$INVITATIONS_URL"

echo "Setting INVITATIONS_SERVICE_API_KEY in main app..."
railway variables --service passbook-flora --set INVITATIONS_SERVICE_API_KEY="$API_KEY"

echo ""
echo -e "${GREEN}✅ Main app configured with invitations service URL!${NC}"
echo ""

echo -e "${YELLOW}Step 5: Verify Deployment${NC}"
echo ""
echo "Testing health endpoint..."
curl -s "$INVITATIONS_URL/health" | jq . || echo "Health check failed or jq not installed"

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Summary:"
echo "  Invitations Service URL: $INVITATIONS_URL"
echo "  Main App URL: https://api.flora.passbook.vc"
echo "  API Key (for internal comms): $API_KEY"
echo ""
echo "Next steps:"
echo "  1. Test invitation creation from admin dashboard"
echo "  2. Verify email sending via Brevo"
echo "  3. Test invitation acceptance flow"
echo ""
echo "For detailed testing instructions, see:"
echo "  /microservices/flora-invitations-service/DEPLOYMENT_INSTRUCTIONS.md"
