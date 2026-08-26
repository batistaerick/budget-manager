output "vpc_id" {
  description = "Application VPC identifier."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet identifiers for a future load balancer."
  value       = aws_subnet.public[*].id
}

output "ecr_repository_urls" {
  description = "Container repositories keyed by application."
  value       = { for name, repository in aws_ecr_repository.application : name => repository.repository_url }
}
