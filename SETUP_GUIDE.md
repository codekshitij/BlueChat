# 🛠️ BlueChat Development Environment Setup

## 📋 Prerequisites Installation

We need to install the following tools before we can start building BlueChat:

### 1. **Homebrew** (macOS Package Manager)

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Follow the instructions to add Homebrew to your PATH
```

### 2. **Node.js** (JavaScript Runtime)

```bash
# Install Node.js (LTS version)
brew install node

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

### 3. **pnpm** (Fast Package Manager for Monorepo)

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version  # Should show 8.x.x or higher
```

### 4. **Docker** (Optional but Recommended for Production)

```bash
# Install Docker Desktop for Mac
brew install --cask docker

# Start Docker Desktop from Applications
# Verify installation
docker --version
docker-compose --version
```

### 5. **Git** (Already installed on macOS)

```bash
# Verify Git installation
git --version
```

---

## 🚀 Quick Start Guide

Once you have the prerequisites installed, run these commands:

```bash
# Navigate to project directory
cd /Users/kshitijmishra/BlueChat

# Install dependencies (once we set up the project)
pnpm install

# Start development servers
pnpm dev
```

---

## ⚡ Alternative: Start Without Docker

If you want to start building immediately without Docker:

### Install Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb bluechat_dev
```

### Install Local Redis

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis
```

---

## 🎯 Let's Proceed!

**Option A: Full Setup** (Recommended)
- Install all prerequisites above (15-20 minutes)
- Then I'll set up the complete project structure

**Option B: Quick Start** (Start coding now)
- We'll use online databases (Supabase, Upstash) for now
- Skip Docker for MVP
- Deploy later with proper infrastructure

Which option do you prefer?

---

## 📝 Notes

- **Node.js**: Required for running the application
- **pnpm**: Fast package manager, better for monorepos
- **Docker**: Optional for MVP, we can use cloud services
- **PostgreSQL & Redis**: Can use hosted versions (Railway, Upstash)

Let me know when you've installed Node.js and pnpm, and we'll start building! 🚀
