#!/bin/bash
# Deploy script for Hostinger server
# Usage: bash deploy-hostinger.sh

SERVER="root@89.116.34.21"
APP_DIR="/var/wedding"
APP_NAME="wedding-invite"

echo "=== Deploying Wedding Invitation to Hostinger ==="

# 1. Create app directory on server
ssh $SERVER "mkdir -p $APP_DIR"

# 2. Copy project files (exclude node_modules, .next build)
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  "$(dirname "$0")/" "$SERVER:$APP_DIR/"

# 3. Install + build on server
ssh $SERVER "
  cd $APP_DIR &&
  export DATABASE_URL='file:$APP_DIR/wedding.db' &&
  npm install &&
  npx prisma generate &&
  npx prisma db push --accept-data-loss &&
  npm run build
"

# 4. Setup PM2 to run the app
ssh $SERVER "
  npm install -g pm2 2>/dev/null || true &&
  cd $APP_DIR &&
  export DATABASE_URL='file:$APP_DIR/wedding.db' &&
  pm2 delete $APP_NAME 2>/dev/null || true &&
  pm2 start npm --name '$APP_NAME' -- start -- -p 3001 &&
  pm2 save &&
  pm2 startup
"

echo ""
echo "=== Done! App running at http://89.116.34.21:3001 ==="
echo "=== Wishes API: http://89.116.34.21:3001/api/wishes ==="
