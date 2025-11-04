# IAM Setup Instructions for SST Deployment

This guide will help you set up the necessary IAM permissions to run `sst deploy` for this project.

## Overview

The `iam-policy.json` file contains a comprehensive IAM policy with the minimum required permissions to deploy this SST application. The policy includes permissions for:

- **EC2/VPC**: VPC, subnets, internet gateways, NAT gateways, security groups, route tables
- **ECS**: Clusters, services, task definitions
- **ELB**: Application Load Balancers, target groups, listeners, rules
- **ECR**: Container image repositories
- **IAM**: Execution and task roles for ECS
- **CloudWatch Logs**: Log groups for container logs
- **S3**: SST state management
- **CloudFormation**: Stack management
- **CodeBuild**: Docker image building
- **SSM/Secrets Manager**: Parameter and secret storage

## Option 1: Using AWS Console

### Step 1: Create the IAM Policy

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **IAM** → **Policies**
3. Click **Create policy**
4. Click the **JSON** tab
5. Copy the contents of `iam-policy.json` and paste it into the editor
6. Click **Next: Tags** (optionally add tags)
7. Click **Next: Review**
8. Enter a policy name: `SSTDeploymentPolicy`
9. Enter a description: `Permissions required to deploy SST applications with ECS`
10. Click **Create policy**

### Step 2: Attach the Policy to Your User or Role

#### For IAM User:
1. Navigate to **IAM** → **Users**
2. Click on your username
3. Click **Add permissions** → **Attach policies directly**
4. Search for `SSTDeploymentPolicy`
5. Select the checkbox next to it
6. Click **Next: Review** → **Add permissions**

#### For IAM Role (if using EC2, CodeBuild, or another service):
1. Navigate to **IAM** → **Roles**
2. Click on your role name
3. Click **Add permissions** → **Attach policies**
4. Search for `SSTDeploymentPolicy`
5. Select the checkbox next to it
6. Click **Add permissions**

## Option 2: Using AWS CLI

### Step 1: Create the IAM Policy

```bash
aws iam create-policy \
  --policy-name SSTDeploymentPolicy \
  --policy-document file://iam-policy.json \
  --description "Permissions required to deploy SST applications with ECS"
```

This will output a policy ARN like: `arn:aws:iam::123456789012:policy/SSTDeploymentPolicy`

### Step 2: Attach the Policy

#### For IAM User:
```bash
aws iam attach-user-policy \
  --user-name YOUR_USERNAME \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/SSTDeploymentPolicy
```

#### For IAM Role:
```bash
aws iam attach-role-policy \
  --role-name YOUR_ROLE_NAME \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/SSTDeploymentPolicy
```

Replace:
- `YOUR_USERNAME` with your IAM username
- `YOUR_ROLE_NAME` with your IAM role name
- `ACCOUNT_ID` with your AWS account ID (12-digit number)

## Step 3: Verify Permissions

After attaching the policy, verify your deployment permissions:

### Using AWS Console:
1. Navigate to **IAM** → **Users** (or **Roles**)
2. Click on your user/role
3. Under **Permissions**, you should see `SSTDeploymentPolicy` listed

### Using AWS CLI:
```bash
# For IAM User
aws iam list-attached-user-policies --user-name YOUR_USERNAME

# For IAM Role
aws iam list-attached-role-policies --role-name YOUR_ROLE_NAME
```

## Step 4: Configure AWS Profile (Optional but Recommended)

If you want to use a specific AWS profile for SST deployments, see the detailed guide in [aws-profile-setup.md](aws-profile-setup.md).

Quick setup for a profile named "sst":

```bash
# Configure AWS CLI with profile
aws configure --profile sst

# Deploy using the profile
AWS_PROFILE=sst pnpm sst deploy

# Or set as default for your session
export AWS_PROFILE=sst
pnpm sst deploy
```

## Step 5: Test SST Deployment

Now you can test your deployment:

```bash
# Install dependencies (if not already done)
pnpm install

# Deploy to your development stage (using default profile)
pnpm sst deploy

# Or deploy with a specific AWS profile
AWS_PROFILE=sst pnpm sst deploy

# Or deploy to a specific stage
pnpm sst deploy --stage production
AWS_PROFILE=sst pnpm sst deploy --stage production
```

## Important Notes

### Resource-Level Restrictions (Optional)

The provided policy uses `"Resource": "*"` for simplicity. For enhanced security in production environments, you can restrict permissions to specific resources. For example:

```json
{
  "Sid": "S3Permissions",
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": [
    "arn:aws:s3:::sst-*",
    "arn:aws:s3:::sst-*/*"
  ]
}
```

### Cost Considerations

This policy allows creation of resources that may incur AWS costs:
- **NAT Gateway**: ~$32/month per gateway (only in production stage)
- **Application Load Balancer**: ~$16/month + data processing fees
- **Fargate**: Charged per vCPU-hour and GB-hour
- **ECR Storage**: Charged per GB per month

Your current configuration uses cost-saving measures:
- No NAT Gateway in development stage
- Small Fargate task sizes (0.25 vCPU, 0.5 GB)
- ARM64 architecture for better price/performance

### Principle of Least Privilege

This policy follows the principle of least privilege while ensuring SST deployment succeeds. If you find you need additional permissions for future features (e.g., RDS, ElastiCache, SQS), you'll need to update the policy.

### Alternative: AWS Managed Policies

For quick testing (not recommended for production):
- **PowerUserAccess**: Broad permissions except IAM user/group/role management
- **AdministratorAccess**: Full access (only use if necessary)

Attach these via:
```bash
# PowerUserAccess
aws iam attach-user-policy \
  --user-name YOUR_USERNAME \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# You'll also need IAM permissions, so add:
aws iam attach-user-policy \
  --user-name YOUR_USERNAME \
  --policy-arn arn:aws:iam::aws:policy/IAMFullAccess
```

## Troubleshooting

### "User is not authorized to perform" Error

If you see an error like:
```
User: arn:aws:iam::123456789012:user/username is not authorized to perform: ecs:CreateCluster
```

This means:
1. The policy hasn't been attached yet (wait a few seconds for IAM propagation)
2. The policy is missing the specific permission
3. There's a service control policy (SCP) blocking the action at the organization level

### Policy Size Limit

If you hit IAM's 6,144 character managed policy limit, you can:
1. Split into multiple policies
2. Use inline policies (10,240 character limit)
3. Remove unused permissions (e.g., Secrets Manager if not using it)

### Permission Denied on S3 State Bucket

SST creates an S3 bucket for state management (usually named like `sst-state-{app}-{account}`). Ensure:
1. The bucket doesn't already exist with different permissions
2. Your policy includes S3 permissions
3. The bucket isn't blocked by an SCP

## Security Best Practices

1. **Use IAM Roles** instead of IAM users when possible (for EC2, CodeBuild, etc.)
2. **Enable MFA** on your IAM user if using access keys
3. **Rotate access keys** regularly (every 90 days)
4. **Use temporary credentials** via AWS STS when possible
5. **Audit permissions** regularly using IAM Access Analyzer
6. **Enable CloudTrail** to log all API calls

## Next Steps

After successfully deploying:
1. Review the deployed resources in the AWS Console
2. Check CloudWatch Logs for application logs
3. Test your application via the ALB URL
4. Set up monitoring and alarms
5. Configure custom domains (if needed)

## Support

If you encounter permission issues not covered here:
1. Check the SST documentation: https://docs.sst.dev
2. Review CloudTrail logs to see which permission was denied
3. Add the specific permission to your policy
4. Consider posting in SST Discord for community support

## Summary of Created Resources

When you run `sst deploy`, the following AWS resources will be created:
- 1 VPC with public/private subnets
- 1 Internet Gateway
- 1 NAT Gateway (production only)
- Multiple Security Groups
- 1 ECS Cluster
- 1 ECS Service (Service1)
- 1 Application Load Balancer
- 2 Target Groups
- 1 ALB Listener (port 80)
- 2 ALB Listener Rules
- 1+ ECR Repositories
- Multiple CloudWatch Log Groups
- IAM Roles for ECS task execution
- S3 bucket for SST state

All resources are tagged with SST metadata for easy identification.
