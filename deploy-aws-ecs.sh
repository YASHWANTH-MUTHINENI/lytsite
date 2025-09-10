#!/bin/bash
# 🚀 AWS ECS Fargate LibreOffice Deployment Script
# This script deploys LibreOffice headless conversion service to AWS ECS Fargate

set -e

# Configuration - UPDATE THESE VALUES
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
SERVICE_NAME="powerpoint-converter"
CLUSTER_NAME="powerpoint-cluster"
IMAGE_NAME="powerpoint-converter"

echo "🚀 Deploying LibreOffice PowerPoint Converter to AWS ECS Fargate"
echo "📍 Region: $AWS_REGION"
echo "🔢 Account: $AWS_ACCOUNT_ID"

# Step 1: Create ECR repository
echo "📦 Creating ECR repository..."
aws ecr describe-repositories --repository-names $IMAGE_NAME --region $AWS_REGION || \
aws ecr create-repository --repository-name $IMAGE_NAME --region $AWS_REGION

# Step 2: Get ECR login token
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Step 3: Build and tag Docker image
echo "🐳 Building Docker image..."
docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest

# Step 4: Push image to ECR
echo "⬆️ Pushing image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest

# Step 5: Create ECS cluster
echo "🏗️ Creating ECS cluster..."
aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION || \
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION

# Step 6: Create task execution role (if not exists)
echo "🔑 Creating/checking task execution role..."
aws iam get-role --role-name ecsTaskExecutionRole || \
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Step 7: Register task definition
echo "📋 Registering task definition..."
cat > task-definition.json << EOF
{
  "family": "$SERVICE_NAME",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "$SERVICE_NAME",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$SERVICE_NAME",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json

# Step 8: Create CloudWatch log group
echo "📊 Creating CloudWatch log group..."
aws logs describe-log-groups --log-group-name-prefix "/ecs/$SERVICE_NAME" --region $AWS_REGION || \
aws logs create-log-group --log-group-name "/ecs/$SERVICE_NAME" --region $AWS_REGION

# Step 9: Get default VPC and subnets
echo "🌐 Getting VPC and subnet information..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query "Vpcs[0].VpcId" --output text --region $AWS_REGION)
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text --region $AWS_REGION | tr '\t' ',')

echo "📍 VPC ID: $VPC_ID"
echo "📍 Subnets: $SUBNET_IDS"

# Step 10: Create security group
echo "🛡️ Creating security group..."
SG_ID=$(aws ec2 create-security-group \
  --group-name "$SERVICE_NAME-sg" \
  --description "Security group for $SERVICE_NAME" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text \
  --region $AWS_REGION) || \
SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=$SERVICE_NAME-sg" \
  --query "SecurityGroups[0].GroupId" \
  --output text \
  --region $AWS_REGION)

# Allow inbound HTTP traffic
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 8080 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION || echo "Security group rule already exists"

echo "🛡️ Security Group ID: $SG_ID"

# Step 11: Create ECS service
echo "🚀 Creating ECS service..."
aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name $SERVICE_NAME \
  --task-definition $SERVICE_NAME:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
  --region $AWS_REGION || echo "Service might already exist"

# Step 12: Wait for service to be running
echo "⏳ Waiting for service to be running..."
aws ecs wait services-running --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION

# Step 13: Get the public IP
echo "🔍 Getting service endpoint..."
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query "taskArns[0]" --output text --region $AWS_REGION)
ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text --region $AWS_REGION)
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query "NetworkInterfaces[0].PublicIpAddress" --output text --region $AWS_REGION)

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL: http://$PUBLIC_IP:8080"
echo "🔍 Health check: http://$PUBLIC_IP:8080/health"
echo "📤 Convert endpoint: http://$PUBLIC_IP:8080/convert"
echo ""
echo "💡 Next steps:"
echo "1. Update your backend/wrangler.toml:"
echo "   AWS_CONVERTER_URL = \"http://$PUBLIC_IP:8080\""
echo "2. Deploy your backend: wrangler deploy --config backend/wrangler.toml"
echo "3. Test PowerPoint upload!"
echo ""
echo "💰 Cost estimate: ~$15-30/month for t3.small equivalent"
echo "📊 Monitor at: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$CLUSTER_NAME/services"

# Cleanup
rm -f task-definition.json
