# YnovBank

## Project Description
YnovBank is a fictional banking platform developed as part of a Master's Degree 2 learning unit. This project demonstrates the implementation of a modern banking system allowing users to connect and perform transfers. The project is developed with an automated CI/CD pipeline using GitHub Actions, implementing Gitflow for branch management and semantic-release for versioning.

## Technical Specifications

### Tech Stack
- **Backend**: Go/Gin (REST API)
- **Frontend**: Nuxt.js with TypeScript
- **Database**: SQLite
- **Testing**:
  - Backend: Native Go tests
  - Frontend: Jest for unit and integration tests

### DevOps
- **Git Workflow**: GitFlow with main and develop branch protection
  - Mandatory pull requests for modifications
  - Protected branches requiring approvals
- **CI/CD**: GitHub Actions with the following workflows:
  - **Build and Push**:
    - Dependencies installation (Node.js and Go)
    - Unit tests for API and application
    - Application build
  - **Semantic Release**:
    - Automatic versioning for API and application
    - Changelog generation
    - Version tag creation
  - **Create Release**:
    - Automatic GitHub releases
    - Release notes generation with recent changes
- **Versioning**: semantic-release with Conventional Commits
- **Deployment**:
  - Staging (develop branch): Render or fly.io
  - Production (master branch): Render or fly.io
- **Notifications**: Emails sent to notif-cicd@joelkoussawo.me

## Deliverables
- Git repository link with complete README presenting the project
- Demo (June 26th)
- Report (June 26th) to be sent to formation@joelkoussawo.me

## Report Content
- Context
- CI/CD
- GitHub Actions workflow files content
- Public Git repository link
- Project documentation (Code, Dockerfile, Explanations)

# API

## Prerequisites
- Go 1.21 or higher
- Docker (optional)

## Installation and Startup

### Local Development
```bash
# Clone the repository
git clone https://github.com/kevoneredone/YnovBank.git
cd YnovBank/api

# Install dependencies
go mod tidy

# Launch API in development mode
go run main.go
```

### Production

#### Native Build and Execution
```bash
# Build for Windows
go build -o gin-api.exe

# Build for Linux/MacOS
go build -o gin-api

# Execution
# Windows
./gin-api.exe
# Linux/MacOS
./gin-api
```

#### Docker Usage
```bash
# Build Docker image
docker build -t gin-api .

# Run container
docker run -p 8080:8080 gin-api
```

## Documentation
API documentation is available in the `docs/` directory. It includes:
- Available endpoints
- Data models
- Request examples

## Tests
```bash
# Run all tests
go test ./...

# Run tests with coverage
go test ./... -cover
```

