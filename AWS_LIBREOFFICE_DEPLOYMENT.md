# 🚀 AWS LibreOffice Headless Deployment Guide

## Overview

Deploy LibreOffice headless on AWS using your credits for unlimited PowerPoint to PDF conversion.

## Option 1: AWS Lambda + Layers (Serverless - Recommended)

### Benefits
- **Pay per use**: Only pay for conversions
- **Auto-scaling**: Handles traffic spikes
- **No server management**: Fully serverless
- **Cost effective**: Perfect for credits

### Deployment Steps

1. **Create Lambda Layer with LibreOffice**:
```bash
# Download pre-built LibreOffice layer
wget https://github.com/shelfio/libreoffice-lambda-layer/releases/download/v6.4.6.2/lo-layer.zip

# Or use the ARN (recommended)
# arn:aws:lambda:us-east-1:764866452798:layer:libreoffice:1
```

2. **Create Lambda Function**:
```python
# lambda_function.py
import json
import boto3
import subprocess
import tempfile
import os
from urllib.parse import unquote_plus

def lambda_handler(event, context):
    try:
        # Get file from event (base64 encoded)
        file_content = base64.b64decode(event['file_content'])
        filename = event['filename']
        
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save input file
            input_path = os.path.join(temp_dir, filename)
            with open(input_path, 'wb') as f:
                f.write(file_content)
            
            # Convert using LibreOffice
            output_path = os.path.join(temp_dir, 'output.pdf')
            subprocess.run([
                '/opt/libreoffice/program/soffice',
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', temp_dir,
                input_path
            ], check=True, timeout=30)
            
            # Read converted PDF
            with open(output_path, 'rb') as f:
                pdf_content = f.read()
            
            return {
                'statusCode': 200,
                'body': base64.b64encode(pdf_content).decode('utf-8'),
                'isBase64Encoded': True,
                'headers': {
                    'Content-Type': 'application/pdf'
                }
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

3. **Deploy with AWS CLI**:
```bash
# Create deployment package
zip lambda_function.zip lambda_function.py

# Create function
aws lambda create-function \
  --function-name powerpoint-converter \
  --runtime python3.9 \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://lambda_function.zip \
  --timeout 30 \
  --memory-size 1024 \
  --layers arn:aws:lambda:us-east-1:764866452798:layer:libreoffice:1

# Create API Gateway endpoint
aws apigatewayv2 create-api \
  --name powerpoint-converter-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:YOUR_REGION:YOUR_ACCOUNT:function:powerpoint-converter
```

## Option 2: ECS Fargate (Container - Easier)

### Benefits
- **Easy deployment**: Standard Docker container
- **Predictable costs**: Fixed container pricing
- **Full control**: Complete LibreOffice setup

### Dockerfile
```dockerfile
FROM amazonlinux:2

# Install LibreOffice and dependencies
RUN yum update -y && \
    yum install -y \
    libreoffice \
    python3 \
    python3-pip && \
    yum clean all

# Install Python dependencies
RUN pip3 install flask gunicorn

# Copy application
COPY app.py /app/app.py
WORKDIR /app

# Expose port
EXPOSE 8080

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "60", "app:app"]
```

### Flask Application
```python
# app.py
from flask import Flask, request, send_file
import subprocess
import tempfile
import os
import io

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_powerpoint():
    try:
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400
        
        file = request.files['file']
        
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save uploaded file
            input_path = os.path.join(temp_dir, file.filename)
            file.save(input_path)
            
            # Convert to PDF
            output_path = os.path.join(temp_dir, 'output.pdf')
            subprocess.run([
                'libreoffice',
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', temp_dir,
                input_path
            ], check=True, timeout=60)
            
            # Return PDF
            return send_file(output_path, as_attachment=True, 
                           download_name=file.filename.replace('.pptx', '.pdf'))
            
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

### Deploy to ECS Fargate
```bash
# Build and push to ECR
aws ecr create-repository --repository-name powerpoint-converter
docker build -t powerpoint-converter .
docker tag powerpoint-converter:latest YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/powerpoint-converter:latest
docker push YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/powerpoint-converter:latest

# Create ECS service
aws ecs create-cluster --cluster-name powerpoint-cluster
aws ecs create-service \
  --cluster powerpoint-cluster \
  --service-name powerpoint-service \
  --task-definition powerpoint-converter:1 \
  --desired-count 1 \
  --launch-type FARGATE
```

## Option 3: EC2 with Auto Scaling (Traditional)

### Benefits
- **Full control**: Complete server access
- **Cost predictable**: Reserved instances
- **Easy debugging**: SSH access

### EC2 Setup Script
```bash
#!/bin/bash
# User data script for EC2 instance

# Update system
yum update -y

# Install LibreOffice
yum install -y libreoffice

# Install Node.js for API server
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Create conversion service
cat > /home/ec2-user/server.js << 'EOF'
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: '/tmp/' });

app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }
    
    const inputPath = req.file.path;
    const outputPath = `/tmp/output_${Date.now()}.pdf`;
    
    const cmd = `libreoffice --headless --convert-to pdf --outdir /tmp ${inputPath}`;
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        // Find the generated PDF
        const baseName = path.basename(inputPath);
        const pdfPath = `/tmp/${baseName}.pdf`;
        
        if (fs.existsSync(pdfPath)) {
            res.sendFile(pdfPath, () => {
                // Cleanup
                fs.unlinkSync(inputPath);
                fs.unlinkSync(pdfPath);
            });
        } else {
            res.status(500).json({ error: 'Conversion failed' });
        }
    });
});

app.listen(8080, () => {
    console.log('PowerPoint converter running on port 8080');
});
EOF

# Install dependencies and start service
cd /home/ec2-user
npm init -y
npm install express multer
node server.js &
```

## Cost Comparison (with AWS Credits)

| Option | Monthly Cost | Setup Time | Scalability | Best For |
|--------|-------------|------------|-------------|----------|
| Lambda + Layers | $0-20 | 30 min | Infinite | Production |
| ECS Fargate | $15-50 | 20 min | Auto-scale | Medium volume |
| EC2 t3.small | $15/month | 15 min | Manual | Predictable load |

## Recommended: ECS Fargate Approach

1. **Quick to deploy** (20 minutes)
2. **Uses your AWS credits** efficiently
3. **Auto-scales** with demand
4. **No file size limits**
5. **Easy to monitor** with CloudWatch

## Integration with Your Backend

Update your `backend/src/utils.ts`:

```typescript
// Add AWS conversion service
async function convertUsingAWS(fileBuffer: ArrayBuffer, filename: string, awsEndpoint: string): Promise<ArrayBuffer> {
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), filename);
  
  const response = await fetch(`${awsEndpoint}/convert`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`AWS conversion failed: ${response.statusText}`);
  }
  
  return await response.arrayBuffer();
}
```

## Environment Variables

Add to `backend/wrangler.toml`:
```toml
[vars]
AWS_CONVERTER_URL = "https://your-aws-endpoint.amazonaws.com"
```

Would you like me to help you deploy one of these options? The ECS Fargate approach is probably the best balance of ease and functionality for your use case.
