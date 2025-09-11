# Fix LibreOffice Installation on EC2

## The Problem
Your LibreOffice service is running on EC2 (3.110.196.217:8080) but LibreOffice itself is not installed, causing the error:
```
/bin/sh: libreoffice: command not found
```

## Solution: Install LibreOffice on EC2

### Step 1: Connect to your EC2 instance
```bash
ssh -i your-key.pem ec2-user@3.110.196.217
# or
ssh -i your-key.pem ubuntu@3.110.196.217
```

### Step 2: Install LibreOffice
For Amazon Linux 2 / CentOS / RHEL:
```bash
sudo yum update -y
sudo yum install -y libreoffice-headless
```

For Ubuntu / Debian:
```bash
sudo apt update
sudo apt install -y libreoffice-headless
```

### Step 3: Verify installation
```bash
libreoffice --version
```

### Step 4: Restart your Node.js service
```bash
# Find the process
ps aux | grep node

# Kill and restart (or if using PM2)
pm2 restart all

# Or if using systemd
sudo systemctl restart your-service-name
```

### Step 5: Test the service
```bash
curl -X GET http://localhost:8080/health
curl -X POST -F "file=@test.txt" http://localhost:8080/convert
```

## Alternative: Install with fonts for better conversion
```bash
# Amazon Linux 2
sudo yum install -y libreoffice-headless libreoffice-calc libreoffice-impress libreoffice-writer

# Ubuntu
sudo apt install -y libreoffice-headless libreoffice-calc libreoffice-impress libreoffice-writer fonts-liberation fonts-dejavu-core

# Install Microsoft-compatible fonts (optional)
sudo apt install -y ttf-mscorefonts-installer
```

## Quick Test Commands
After installation, test locally on the EC2 instance:
```bash
# Test direct LibreOffice command
echo "test" > test.txt
libreoffice --headless --convert-to pdf test.txt

# Test your service
curl -X POST -F "file=@test.txt" http://localhost:8080/convert
```

## If you don't have SSH access
You can also create a user data script to install LibreOffice when launching the instance, or use AWS Systems Manager Session Manager to connect without SSH keys.
