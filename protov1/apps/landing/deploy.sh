#!/bin/bash
# Deploy landing page to Hostinger via FTP

# Load environment variables
if [ -f ../../.env ]; then
  export $(cat ../../.env | grep -v '^#' | xargs)
fi

# Check if FTP credentials are set
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASSWORD" ]; then
  echo "Error: FTP credentials not set in .env file"
  echo "Please set FTP_HOST, FTP_USER, FTP_PASSWORD, and FTP_PATH"
  exit 1
fi

echo "Deploying landing page to Hostinger..."

# Install lftp if not installed (macOS)
if ! command -v lftp &> /dev/null; then
  echo "Installing lftp..."
  brew install lftp
fi

# Upload files via FTP
lftp -c "
set ftp:ssl-allow no;
open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST;
cd $FTP_PATH;
mirror -R --delete --verbose . .;
bye;
"

echo "✓ Landing page deployed successfully!"
echo "Visit: https://yourdomain.com"
