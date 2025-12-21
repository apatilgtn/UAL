# UAL Platform - Universal Access Layer

A modern, secure platform for unified access to organizational systems with OAuth authentication and integrated CRM functionality.

## 🚀 Features

- **OAuth Authentication** - Secure login with Google & GitHub
- **CRM System** - Contacts, Deals, Tasks, and Companies management
- **API Explorer** - Centralized API discovery and documentation
- **System Catalog** - Browse and explore all organizational systems
- **Data Discovery** - Find datasets across multiple systems
- **Premium UI** - Modern glassmorphism design with dark mode

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Docker & Docker Compose (for containerized deployment)
- Git

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd UAL
   ```

2. **Install dependencies**
   ```bash
   cd ual-platform
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your OAuth credentials
   ```

4. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   ```
   http://localhost:3000
   ```

3. **View logs**
   ```bash
   docker-compose logs -f ual-platform
   ```

4. **Stop containers**
   ```bash
   docker-compose down
   ```

## 📦 Project Structure

```
UAL/
├── ual-platform/          # Next.js application
│   ├── app/               # Next.js app directory
│   │   ├── auth/          # Authentication pages
│   │   ├── crm/           # CRM pages
│   │   ├── api-explorer/  # API discovery
│   │   └── explore/       # System catalog
│   ├── components/        # React components
│   ├── lib/               # Utilities and data
│   └── prisma/            # Database schema
├── ual-framework/         # UAL core framework
│   ├── core/              # Core interfaces
│   └── connectors/        # System connectors
├── Dockerfile             # Production Docker image
└── docker-compose.yml     # Container orchestration
```

## 🔐 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Secret to `.env.local`

## 🐳 Docker Commands

```bash
# Build image
docker build -t ual-platform .

# Run container
docker run -p 3000:3000 ual-platform

# Push to registry
docker tag ual-platform:latest your-registry/ual-platform:latest
docker push your-registry/ual-platform:latest

# Run with CRM services
docker-compose --profile crm up -d
```

## 🔄 Version Control Workflow

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: UAL Platform with OAuth and CRM"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Regular Updates
```bash
# Before making changes
git pull origin main

# After making changes
git add .
git commit -m "Description of changes"
git push origin main
```

## 🚢 Deployment to Docker Registry

### Step 1: Build Production Image
```bash
docker build -t your-username/ual-platform:v1.0.0 .
```

### Step 2: Push to Docker Hub
```bash
# Login
docker login

# Push versioned image
docker push your-username/ual-platform:v1.0.0

# Tag and push as latest
docker tag your-username/ual-platform:v1.0.0 your-username/ual-platform:latest
docker push your-username/ual-platform:latest
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Contains sensitive credentials
2. **Use Docker secrets** in production
3. **Rotate OAuth credentials** regularly
4. **Enable 2FA** on OAuth providers
5. **Use HTTPS** in production
6. **Keep dependencies updated** - `npm audit`

## 📝 License

This project is licensed under the MIT License.
