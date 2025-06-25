# YnovBank [![Build, Test and Deploy - Main Branch](https://github.com/KevOneRedOne/YnovBank/actions/workflows/main-ci.yml/badge.svg?branch=main)](https://github.com/KevOneRedOne/YnovBank/actions/workflows/main-ci.yml) [![Build, Test and Deploy - Develop Branch](https://github.com/KevOneRedOne/YnovBank/actions/workflows/develop-ci.yml/badge.svg?branch=develop)](https://github.com/KevOneRedOne/YnovBank/actions/workflows/develop-ci.yml)

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
  - **Build and Test**:
    - Dependencies installation (Node.js and Go)
    - Unit tests for API (Go), API Express, and application
    - Application build
  - **Semantic Release**:
    - Automatic versioning for Go API, Express API, and application
    - Changelog generation for all components
    - Version tag creation
  - **Docker Images**:
    - Building Docker images for all components
    - Tagging with version and environment (develop/prod)
    - Publishing to Docker Hub registry
  - **Create Release**:
    - Automatic GitHub releases
    - Release notes generation with recent changes
    - Different release types for develop (pre-release) and main
  - **Version Bump**:
    - Automatic incrementation of versions after each release
    - Development tags for develop branch (`-dev` suffix)
    - Production version increments for main branch
- **Versioning**: semantic-release with Conventional Commits
- **Deployment**:
  - Staging (develop branch): Docker containers with develop tags
  - Production (main branch): Docker containers with prod tags
- **Docker Registry**: Docker Hub for container images
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

## CI/CD Pipeline Details

### Workflow Structure
The CI/CD pipeline is implemented using GitHub Actions with two main workflows:

1. **`develop-ci.yml`** - Triggered on push and pull requests to the develop branch
2. **`main-ci.yml`** - Triggered on push and pull requests to the main branch

### Job Sequence for Develop Branch
1. **Build and Test**
   - Checkout code
   - Setup Node.js and Go environments
   - Install dependencies
   - Run tests for all components
   - Build applications

2. **Semantic Release** 
   - Apply semantic versioning based on commit messages
   - Generate changelogs for all components
   - Create version file for Go API
   - Update package.json versions for React app and Express API

3. **Docker Images**
   - Build Docker images for all components:
     - React/Nuxt.js application
     - Golang API
     - Express API
   - Tag images with:
     - Latest version
     - Specific version number
     - `develop` environment tag
   - Push images to Docker Hub registry

4. **Create Release**
   - Create GitHub pre-release with `-dev` suffix
   - Generate comprehensive release notes
   - Include version information for all components
   - Link to documentation

5. **Bump Version**
   - Increment version numbers for next development cycle
   - Add development tags (`-dev`) to versions
   - Commit version changes to repository

### Job Sequence for Main Branch
Similar to the develop branch workflow but with production-specific settings:
- Docker images tagged with `prod` instead of `develop`
- Full releases instead of pre-releases
- Production-ready version numbers without development tags

### Version Management
- **API (Go)**: Version stored in `version.txt` file, managed by go-semantic-release
- **App**: Version stored in `package.json`, managed by semantic-release
- **Express API**: Version stored in `package.json`, managed by semantic-release
- **Development Versions**: Include `-dev.X` suffix for develop branch
- **Production Versions**: Follow semantic versioning (X.Y.Z) for main branch

### Docker Image Registry
Images are published to Docker Hub with the following naming convention:
- `username/ynovbank-app:[version|latest|develop|prod]`
- `username/ynovbank-api:[version|latest|develop|prod]`
- `username/ynovbank-api-express:[version|latest|develop|prod]`

These workflows ensure consistent, automated deployment processes for both development and production environments.

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

# Or use pre-built images from Docker Hub
docker pull username/ynovbank-api:latest
docker run -p 8080:8080 username/ynovbank-api:latest

# For specific version
docker pull username/ynovbank-api:1.2.3
docker run -p 8080:8080 username/ynovbank-api:1.2.3

# For development version
docker pull username/ynovbank-api:develop
docker run -p 8080:8080 username/ynovbank-api:develop

# For production version
docker pull username/ynovbank-api:prod
docker run -p 8080:8080 username/ynovbank-api:prod
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

# Application

## Prerequisites
- Node.js 18 or higher
- Docker (optional)

## Installation and Startup

### Local Development
```bash
# Clone the repository
git clone https://github.com/kevoneredone/YnovBank.git
cd YnovBank/app

# Install dependencies
npm install

# Launch app in development mode
npm run dev
```

### Production

#### Native Build and Execution
```bash
# Build application
npm run build

# Start production server
npm run start
```

#### Docker Usage
```bash
# Build Docker image
docker build -t ynovbank-app .

# Run container
docker run -p 3000:3000 ynovbank-app

# Or use pre-built images from Docker Hub
docker pull username/ynovbank-app:latest
docker run -p 3000:3000 username/ynovbank-app:latest

# For specific version
docker pull username/ynovbank-app:1.2.3
docker run -p 3000:3000 username/ynovbank-app:1.2.3

# For development version
docker pull username/ynovbank-app:develop
docker run -p 3000:3000 username/ynovbank-app:develop

# For production version
docker pull username/ynovbank-app:prod
docker run -p 3000:3000 username/ynovbank-app:prod
```

## Tests
```bash
# Run tests
npm test
```

# API Express

## Prerequisites
- Node.js 18 or higher
- Docker (optional)

## Installation and Startup

### Local Development
```bash
# Clone the repository
git clone https://github.com/kevoneredone/YnovBank.git
cd YnovBank/api-express

# Install dependencies
npm install

# Launch API in development mode
npm run dev
```

### Production

#### Native Build and Execution
```bash
# Build application
npm run build

# Start production server
npm run start
```

#### Docker Usage
```bash
# Build Docker image
docker build -t ynovbank-api-express .

# Run container
docker run -p 4000:4000 ynovbank-api-express

# Or use pre-built images from Docker Hub
docker pull username/ynovbank-api-express:latest
docker run -p 4000:4000 username/ynovbank-api-express:latest

# For specific version
docker pull username/ynovbank-api-express:1.2.3
docker run -p 4000:4000 username/ynovbank-api-express:1.2.3

# For development version
docker pull username/ynovbank-api-express:develop
docker run -p 4000:4000 username/ynovbank-api-express:develop

# For production version
docker pull username/ynovbank-api-express:prod
docker run -p 4000:4000 username/ynovbank-api-express:prod
```

## Tests
```bash
# Run tests
npm test
```

