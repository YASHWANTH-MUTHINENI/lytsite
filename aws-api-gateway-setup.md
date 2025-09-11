# AWS API Gateway Setup for LibreOffice Service

## Overview
We need to create an AWS API Gateway that proxies requests to your LibreOffice service running on EC2 (3.110.196.217:8080). This will provide an HTTPS endpoint that Cloudflare Workers can access.

## Step 1: Create API Gateway

1. **Go to AWS Console** → **API Gateway**
2. **Create API** → **REST API** → **Build**
3. **API Name**: `libreoffice-converter-api`
4. **Description**: `Proxy for LibreOffice PowerPoint conversion service`
5. **Endpoint Type**: `Regional` (recommended for better performance)

## Step 2: Create Resource and Method

1. **Actions** → **Create Resource**
   - Resource Name: `convert`
   - Resource Path: `/convert`
   - Enable CORS: ✅ (checked)

2. **Actions** → **Create Method** → **POST**
   - Integration Type: **HTTP**
   - HTTP Method: **POST**
   - Endpoint URL: `http://3.110.196.217:8080/convert`
   - Content Handling: **Passthrough**

## Step 3: Configure Integration Request

1. Click on **Integration Request**
2. **HTTP Headers**:
   - Add header: `Content-Type` → `application/x-www-form-urlencoded`
3. **Body Mapping Templates**:
   - Content-Type: `application/json`
   - Template: `$input.body`

## Step 4: Configure Method Response

1. Click on **Method Response**
2. **Add Response**:
   - HTTP Status: `200`
   - Response Headers:
     - `Access-Control-Allow-Origin`: `'*'`
     - `Access-Control-Allow-Headers`: `'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'`
     - `Access-Control-Allow-Methods`: `'POST,OPTIONS'`

## Step 5: Configure Integration Response

1. Click on **Integration Response**
2. **200 Response**:
   - Header Mappings:
     - `Access-Control-Allow-Origin`: `'*'`
     - `Access-Control-Allow-Headers`: `'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'`
     - `Access-Control-Allow-Methods`: `'POST,OPTIONS'`

## Step 6: Enable CORS

1. **Actions** → **Enable CORS**
2. **Access-Control-Allow-Origin**: `*`
3. **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
4. **Access-Control-Allow-Methods**: `POST,OPTIONS`

## Step 7: Deploy API

1. **Actions** → **Deploy API**
2. **Deployment stage**: `prod`
3. **Stage description**: `Production deployment`

## Step 8: Get API Endpoint

After deployment, you'll get an endpoint like:
`https://your-api-id.execute-api.region.amazonaws.com/prod/convert`

## Step 9: Test the Endpoint

```bash
curl -X POST \
  https://your-api-id.execute-api.region.amazonaws.com/prod/convert \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@test.pptx'
```

## Step 10: Update Worker Configuration

Update your `wrangler.toml`:
```toml
AWS_CONVERTER_URL = "https://your-api-id.execute-api.region.amazonaws.com/prod"
```

## Alternative: Quick CloudFormation Template

Save this as `api-gateway.yaml` and deploy via CloudFormation:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'API Gateway proxy for LibreOffice service'

Resources:
  LibreOfficeAPI:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: libreoffice-converter-api
      Description: Proxy for LibreOffice PowerPoint conversion service
      EndpointConfiguration:
        Types:
          - REGIONAL

  ConvertResource:
    Type: AWS::ApiGateway::Resource
    Properties:
      RestApiId: !Ref LibreOfficeAPI
      ParentId: !GetAtt LibreOfficeAPI.RootResourceId
      PathPart: convert

  ConvertMethod:
    Type: AWS::ApiGateway::Method
    Properties:
      RestApiId: !Ref LibreOfficeAPI
      ResourceId: !Ref ConvertResource
      HttpMethod: POST
      AuthorizationType: NONE
      Integration:
        Type: HTTP
        IntegrationHttpMethod: POST
        Uri: http://3.110.196.217:8080/convert
        PassthroughBehavior: WHEN_NO_MATCH
        IntegrationResponses:
          - StatusCode: 200
            ResponseParameters:
              method.response.header.Access-Control-Allow-Origin: "'*'"
      MethodResponses:
        - StatusCode: 200
          ResponseParameters:
            method.response.header.Access-Control-Allow-Origin: true

  Deployment:
    Type: AWS::ApiGateway::Deployment
    DependsOn: ConvertMethod
    Properties:
      RestApiId: !Ref LibreOfficeAPI
      StageName: prod

Outputs:
  ApiEndpoint:
    Description: 'API Gateway endpoint URL'
    Value: !Sub 'https://${LibreOfficeAPI}.execute-api.${AWS::Region}.amazonaws.com/prod'
```

Deploy with:
```bash
aws cloudformation create-stack --stack-name libreoffice-api --template-body file://api-gateway.yaml
```
