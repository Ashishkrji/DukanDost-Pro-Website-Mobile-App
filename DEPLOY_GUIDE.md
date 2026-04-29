# VPS Deployment & Setup Guide (Ubuntu 22.04+)

This guide provides the necessary steps to prepare a fresh VPS for DukanDost Pro.

## 0. Automated Setup (Recommended)
We have provided an automated setup script. Copy `scripts/setup_vps.sh` to your server and run it:
```bash
chmod +x setup_vps.sh
./setup_vps.sh
```

## 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl build-essential libssl-dev
```

## 2. Install Node.js (v20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3. Install & Configure MongoDB
```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 4. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## 5. Setup Nginx & SSL
```bash
sudo apt install -y nginx
# Copy the nginx.conf.template to /etc/nginx/sites-available/dukandost
# Then symlink it:
# sudo ln -s /etc/nginx/sites-available/dukandost /etc/nginx/sites-enabled/

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
# sudo certbot --nginx -d api.dukandost.pro -d app.dukandost.pro
```

## 6. Directory Structure
```bash
sudo mkdir -p /var/www/dukandost-pro
sudo chown -R $USER:$USER /var/www/dukandost-pro
```

## 7. Environment Variables
Create a `.env` file in `/var/www/dukandost-pro/Backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dukandost_pro
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=...
...
```

## 8. Deployment Command
The CI/CD pipeline (`main.yml`) will handle updates, but manual start:
```bash
cd /var/www/dukandost-pro/Backend
npm install --production
pm2 start server.ts --interpreter tsx --name dukandost-api
```
