# Delivery workflow

Use short-lived branches and Conventional Commit messages. Before opening a pull
request, run `make check`, `make build`, and `make compose-config`. Run
`make terraform-check` whenever infrastructure changes.

CI applies the same checks with locked dependencies. Do not suppress static
analysis without documenting the finding, exposure, owner, and intended removal.
