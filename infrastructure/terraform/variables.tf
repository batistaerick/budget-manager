variable "aws_region" {
  description = "AWS region used by Budget Manager."
  type        = string
  default     = "sa-east-1"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "vpc_cidr" {
  description = "CIDR allocated to the application VPC."
  type        = string
  default     = "10.42.0.0/16"
}
