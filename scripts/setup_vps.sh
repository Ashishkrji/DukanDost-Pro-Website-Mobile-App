#!/bin/bash

# DukanDost Pro - VPS Automated Setup Script
# Target: Ubuntu 22.04 LTS

echo "Starting VPS Setup for DukanDost Pro..."

# 1. Update and Install Essentials
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential libssl-dev nginx certbot python3-certbot-nginx

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# 4. Install PM2
sudo npm install -g pm2

# 5. Prepare Web Directory
sudo mkdir -p /var/www/dukandost-pro
sudo chown -R $USER:$USER /var/www/dukandost-pro

# 6. Setup Firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "------------------------------------------------"
echo "Setup Complete!"
echo "Next Steps:"
echo "1. Clone your repository into /var/www/dukandost-pro"
echo "2. Create your .env file in /var/www/dukandost-pro/Backend"
echo "3. Run 'npm install --production' in Backend and Frontend"
echo "4. Configure Nginx using nginx.conf.template"
echo "5. Run 'certbot --nginx' for SSL"
echo "------------------------------------------------"
