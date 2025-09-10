# 🚀 AWS ECS Fargate LibreOffice Deployment Script (PowerShell)
# Deploy LibreOffice headless conversion service to AWS ECS Fargate

param(
    [string]$Region = "ap-south-1",
    [string]$ServiceName = "powerpoint-converter"
)

Write-Host "🚀 Deploying LibreOffice PowerPoint Converter to AWS ECS Fargate" -ForegroundColor Green
Write-Host "📍 Region: $Region" -ForegroundColor Cyan

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check AWS CLI
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Get AWS account ID
try {
    $AccountId = aws sts get-caller-identity --query Account --output text
    Write-Host "✅ AWS Account ID: $AccountId" -ForegroundColor Green
} catch {
    Write-Host "❌ Unable to get AWS account ID. Please check AWS credentials." -ForegroundColor Red
    exit 1
}

$ClusterName = "powerpoint-cluster"
$ImageName = "powerpoint-converter"

# Step 1: Prepare AWS files
Write-Host "📦 Preparing deployment files..." -ForegroundColor Yellow

# Copy package.json for AWS
Copy-Item "package.json.aws" "package.json" -Force

# Step 2: Create ECR repository
Write-Host "📦 Creating ECR repository..." -ForegroundColor Yellow
try {
    aws ecr describe-repositories --repository-names $ImageName --region $Region | Out-Null
    Write-Host "✅ ECR repository already exists" -ForegroundColor Green
} catch {
    aws ecr create-repository --repository-name $ImageName --region $Region | Out-Null
    Write-Host "✅ ECR repository created" -ForegroundColor Green
}

# Step 3: Login to ECR
Write-Host "🔐 Logging into ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com"

# Step 4: Build Docker image
Write-Host "🐳 Building Docker image..." -ForegroundColor Yellow
docker build -f Dockerfile.aws -t $ImageName .
docker tag "$ImageName:latest" "$AccountId.dkr.ecr.$Region.amazonaws.com/$ImageName:latest"

# Step 5: Push to ECR
Write-Host "⬆️ Pushing to ECR..." -ForegroundColor Yellow
docker push "$AccountId.dkr.ecr.$Region.amazonaws.com/$ImageName:latest"

# Step 6: Create ECS cluster
Write-Host "🏗️ Creating ECS cluster..." -ForegroundColor Yellow
try {
    aws ecs describe-clusters --clusters $ClusterName --region $Region | Out-Null
    Write-Host "✅ ECS cluster already exists" -ForegroundColor Green
} catch {
    aws ecs create-cluster --cluster-name $ClusterName --region $Region | Out-Null
    Write-Host "✅ ECS cluster created" -ForegroundColor Green
}

# Step 7: Create execution role
Write-Host "🔑 Creating task execution role..." -ForegroundColor Yellow
$rolePolicyDocument = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Principal = @{
                Service = "ecs-tasks.amazonaws.com"
            }
            Action = "sts:AssumeRole"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    aws iam get-role --role-name ecsTaskExecutionRole | Out-Null
    Write-Host "✅ Task execution role already exists" -ForegroundColor Green
} catch {
    $rolePolicyDocument | Out-File -FilePath "trust-policy.json" -Encoding utf8
    aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://trust-policy.json | Out-Null
    aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" | Out-Null
    Remove-Item "trust-policy.json" -Force
    Write-Host "✅ Task execution role created" -ForegroundColor Green
}

# Step 8: Create task definition
Write-Host "📋 Creating task definition..." -ForegroundColor Yellow
$taskDefinition = @{
    family = $ServiceName
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "512"
    memory = "1024"
    executionRoleArn = "arn:aws:iam::$AccountId:role/ecsTaskExecutionRole"
    containerDefinitions = @(
        @{
            name = $ServiceName
            image = "$AccountId.dkr.ecr.$Region.amazonaws.com/$ImageName:latest"
            portMappings = @(
                @{
                    containerPort = 8080
                    protocol = "tcp"
                }
            )
            essential = $true
            logConfiguration = @{
                logDriver = "awslogs"
                options = @{
                    "awslogs-group" = "/ecs/$ServiceName"
                    "awslogs-region" = $Region
                    "awslogs-stream-prefix" = "ecs"
                }
            }
            environment = @(
                @{
                    name = "NODE_ENV"
                    value = "production"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$taskDefinition | Out-File -FilePath "task-definition.json" -Encoding utf8
aws ecs register-task-definition --cli-input-json file://task-definition.json | Out-Null
Remove-Item "task-definition.json" -Force

# Step 9: Create CloudWatch log group
Write-Host "📊 Creating CloudWatch log group..." -ForegroundColor Yellow
try {
    aws logs describe-log-groups --log-group-name-prefix "/ecs/$ServiceName" --region $Region | Out-Null
    Write-Host "✅ Log group already exists" -ForegroundColor Green
} catch {
    aws logs create-log-group --log-group-name "/ecs/$ServiceName" --region $Region | Out-Null
    Write-Host "✅ Log group created" -ForegroundColor Green
}

# Step 10: Get VPC info
Write-Host "🌐 Getting VPC information..." -ForegroundColor Yellow
$VpcId = aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query "Vpcs[0].VpcId" --output text --region $Region
$SubnetIds = aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VpcId" --query "Subnets[*].SubnetId" --output text --region $Region
$SubnetList = $SubnetIds -replace '\s+', ','

Write-Host "📍 VPC ID: $VpcId" -ForegroundColor Cyan
Write-Host "📍 Subnets: $SubnetList" -ForegroundColor Cyan

# Step 11: Create security group
Write-Host "🛡️ Creating security group..." -ForegroundColor Yellow
try {
    $SgId = aws ec2 describe-security-groups --filters "Name=group-name,Values=$ServiceName-sg" --query "SecurityGroups[0].GroupId" --output text --region $Region
    if ($SgId -eq "None" -or $SgId -eq "") { throw "Not found" }
    Write-Host "✅ Security group already exists: $SgId" -ForegroundColor Green
} catch {
    $SgId = aws ec2 create-security-group --group-name "$ServiceName-sg" --description "Security group for $ServiceName" --vpc-id $VpcId --query 'GroupId' --output text --region $Region
    Write-Host "✅ Security group created: $SgId" -ForegroundColor Green
}

# Allow HTTP traffic
try {
    aws ec2 authorize-security-group-ingress --group-id $SgId --protocol tcp --port 8080 --cidr "0.0.0.0/0" --region $Region | Out-Null
    Write-Host "✅ Security group rule added" -ForegroundColor Green
} catch {
    Write-Host "✅ Security group rule already exists" -ForegroundColor Green
}

# Step 12: Create ECS service
Write-Host "🚀 Creating ECS service..." -ForegroundColor Yellow
try {
    aws ecs create-service --cluster $ClusterName --service-name $ServiceName --task-definition "$ServiceName:1" --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[$SubnetList],securityGroups=[$SgId],assignPublicIp=ENABLED}" --region $Region | Out-Null
    Write-Host "✅ ECS service created" -ForegroundColor Green
} catch {
    Write-Host "✅ ECS service already exists" -ForegroundColor Green
}

# Step 13: Wait for service
Write-Host "⏳ Waiting for service to be running..." -ForegroundColor Yellow
aws ecs wait services-running --cluster $ClusterName --services $ServiceName --region $Region

# Step 14: Get public IP
Write-Host "🔍 Getting service endpoint..." -ForegroundColor Yellow
$TaskArn = aws ecs list-tasks --cluster $ClusterName --service-name $ServiceName --query "taskArns[0]" --output text --region $Region
$EniId = aws ecs describe-tasks --cluster $ClusterName --tasks $TaskArn --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text --region $Region
$PublicIp = aws ec2 describe-network-interfaces --network-interface-ids $EniId --query "NetworkInterfaces[0].PublicIpAddress" --output text --region $Region

# Display results
Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Service URL: http://$PublicIp:8080" -ForegroundColor Cyan
Write-Host "🔍 Health check: http://$PublicIp:8080/health" -ForegroundColor Cyan
Write-Host "📤 Convert endpoint: http://$PublicIp:8080/convert" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your backend/wrangler.toml:" -ForegroundColor White
Write-Host "   AWS_CONVERTER_URL = `"http://$PublicIp:8080`"" -ForegroundColor Green
Write-Host "2. Deploy your backend:" -ForegroundColor White
Write-Host "   wrangler deploy --config backend/wrangler.toml" -ForegroundColor Green
Write-Host "3. Test PowerPoint upload!" -ForegroundColor White
Write-Host ""
Write-Host "💰 Cost estimate: ~$15-30/month" -ForegroundColor Magenta
Write-Host "📊 Monitor at: https://console.aws.amazon.com/ecs/home?region=$Region#/clusters/$ClusterName/services" -ForegroundColor Cyan

# Clean up temporary files
if (Test-Path "package.json") { Remove-Item "package.json" -Force }

Write-Host ""
Write-Host "🎉 Ready to convert PowerPoint files with unlimited size!" -ForegroundColor Green
