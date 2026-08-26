# AWS Terraform foundation

This stack creates a tagged VPC, two public subnets, internet routing, and
immutable/scanned ECR repositories for the API and web images. It deliberately
does not create paid runtime or database services yet.

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```

State is local by default. Configure a remote encrypted backend before sharing an
environment or applying production infrastructure. Review the plan and expected
AWS cost before every apply.
