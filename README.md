# 🔵 BlueChat - Ephemeral Time-Boxed Chat Platform

A modern, real-time chat web application featuring **ephemeral time-boxed rooms** and **multi-threaded conversations**. Built with React, TypeScript, Vite, and Firebase.

> **Status**: 🚧 In Active Development | **Version**: 1.0.0-alpha

## ✨ Unique Features

### 🌟 What Makes BlueChat Different

- **⏰ Ephemeral Rooms** - All chat rooms automatically delete after 1hr, 4hr, 8hr, or 24hr
- **🧵 Multi-Threading** - Click any message to start a focused sub-conversation
- **📅 Scheduled Rooms** - Create rooms that start at a specific future time (perfect for events)
- **💾 Archive Mode** - Save conversation highlights before the room expires
- **⚡ Real-Time Everything** - Live countdowns, instant messaging, typing indicators

### 💡 Why This Combination is Unique

No other chat application combines ephemeral messaging with multi-threaded conversations. BlueChat creates urgency (rooms disappear!) while keeping discussions organized (threads reduce clutter).

**Perfect For:**
- Study groups that don't need permanent history
- Event-based discussions (conferences, meetups)
- Privacy-conscious conversations
- Temporary team collaborations
- Focus groups and brainstorming sessions

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd BlueChat

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Access the App

- **Web App**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **WebSocket**: ws://localhost:5001

## 🏗️ Architecture

### Monorepo Structure

```
BlueChat/
├── packages/
│   ├── client/          # React frontend (Vite + TypeScript + Tailwind)
│   └── server/          # Node.js backend (Express + Socket.IO + TypeScript)
├── docs/                # Documentation
├── pnpm-workspace.yaml  # Workspace configuration
└── package.json         # Root package scripts
```

### Tech Stack

#### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast dev server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - WebSocket client
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

#### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **Socket.IO** - Real-time bi-directional communication
- **Prisma** - Database ORM (PostgreSQL)
- **Bull** - Job queue for timed room deletions
- **Redis** - Caching and job queue
- **JWT** - Authentication
- **Helmet** - Security middleware

#### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Railway/Render** - Hosting (planned)

## 📋 Available Commands

```bash
# Development
pnpm dev              # Start both client and server
pnpm dev:client       # Start only frontend
pnpm dev:server       # Start only backend

# Building
pnpm build            # Build both packages
pnpm build:client     # Build frontend
pnpm build:server     # Build backend

# Type checking
pnpm type-check       # Check types in all packages

# Cleaning
pnpm clean            # Remove all node_modules and dist folders
```

## 🎯 Current Development Status

### ✅ Completed
- [x] Monorepo setup with pnpm workspaces
- [x] Frontend React app with Vite
- [x] Backend Express server with TypeScript
- [x] WebSocket server with Socket.IO
- [x] Basic UI with Tailwind CSS
- [x] Development environment configured

### 🚧 In Progress
- [ ] Database schema with Prisma
- [ ] Authentication system (JWT + Guest mode)
- [ ] Room CRUD operations
- [ ] Timer/expiration with Bull queues

### 📅 Planned
- [ ] Multi-threaded conversations
- [ ] Real-time messaging
- [ ] Scheduled rooms
- [ ] Archive/highlights feature
- [ ] Production deployment
- [ ] Comprehensive testing

## 🔧 Development

### Project Structure

#### Client (`packages/client/`)
```
src/
├── components/       # Reusable UI components
│   ├── chat/        # Chat-related components
│   ├── rooms/       # Room management components
│   ├── threads/     # Threading components
│   └── ui/          # Base UI components
├── hooks/           # Custom React hooks
├── store/           # Zustand state management
├── services/        # API and WebSocket services
├── pages/           # Route pages
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

#### Server (`packages/server/`)
```
src/
├── controllers/     # Route controllers
├── services/        # Business logic
├── models/          # Database models (Prisma)
├── socket/          # WebSocket event handlers
├── middleware/      # Express middleware
├── routes/          # API routes
├── jobs/            # Background jobs (Bull)
├── config/          # Configuration
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

### Environment Variables

Copy `.env.example` to `.env` in the server package and configure:

```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## 📚 Documentation

- [Complete Project Plan](./plan.md) - Full technical specification
- [Setup Guide](./SETUP_GUIDE.md) - Detailed environment setup
- [Action Plan](./ACTION_PLAN.md) - Development roadmap
- [Next Steps](./NEXT_STEPS.md) - Decision guide
- [Current Status](./STATUS.md) - What's working now

## 🎨 Design System

### Color Palette (Warm Earthy Theme)
- **Light Background**: `#FEFAE0` - Warm cream
- **Dark Background**: `#283618` - Deep olive green
- **Primary**: `#606C38` - Olive green
- **Secondary**: `#DDA15E` - Warm golden
- **Accent**: `#BC6C25` - Golden brown

### Key UI Components
- Room cards with live countdown timers
- Message bubbles (self vs others)
- Thread sidebar/panel
- Archive modal
- Scheduled room cards
- Online user indicators

## 🤝 Contributing

This is currently a portfolio/resume project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for portfolio/educational purposes.

## 🙏 Acknowledgments

- Inspired by the ephemeral nature of Snapchat and Clubhouse
- Threading concept from Discord and Slack
- Privacy-first approach

## 📞 Contact

**Developer**: Kshitij Mishra  
**Project**: BlueChat - Full-Stack Chat Application  
**Purpose**: Portfolio/Resume Project

---

**Built with ❤️ using TypeScript, React, and Node.js**

## 🚀 Features

### Core Functionality
- **True Proximity-Based**: Messages sent directly via Bluetooth to nearby devices
- **Local Storage**: All data stored locally on device until leaving chat
- **No Internet Required**: Works completely offline via Bluetooth mesh network
- **Privacy-First**: No external servers, no data leaves your device
- **Real-time Messaging**: Instant communication with nearby users
- **Automatic Cleanup**: Messages cleared when leaving chat for privacy

### Technical Features
- **Bluetooth Mesh Network**: Direct device-to-device communication
- **TypeScript**: Full type safety throughout the app
- **Zustand State Management**: Clean, predictable state management
- **Expo Router**: File-based navigation with dynamic routes
- **AsyncStorage**: Local data persistence
- **Responsive Design**: Works on iOS, Android, and Web

## 🏗️ Architecture

### True Proximity-Based Approach
```
User A sends message → Bluetooth broadcast → All nearby users receive
                ↓
            Local Storage → Messages persist until leaving chat
```

### Project Structure
```
BlueChat/
├── app/                    # Expo Router screens
│   ├── index.tsx          # Username entry screen
│   ├── rooms.tsx          # Available rooms & nearby users
│   └── chat/[roomId].tsx  # Chat room screen
├── components/            # Reusable UI components
│   ├── ui/               # Base components (Button, Input, etc.)
│   └── rooms/            # Room-specific components
├── store/                # Zustand state management
├── services/             # Bluetooth service & business logic
├── types/                # TypeScript type definitions
└── utils/                # Helper functions & local storage
```

### Data Flow
1. **User Entry** → Create user → Initialize Bluetooth node
2. **Room Discovery** → Scan for nearby Bluetooth devices → Display available rooms
3. **Join Room** → Connect to host device via Bluetooth mesh
4. **Send Message** → Broadcast via Bluetooth to all room members
5. **Receive Messages** → Get messages from other devices via Bluetooth
6. **Local Storage** → Messages stored locally until leaving chat

## 🎨 Design System

### Color Palette (Warm Earthy Theme)
- **Light Background**: `#FEFAE0`
- **Dark Background**: `#283618`
- **Primary**: `#606C38`
- **Secondary**: `#DDA15E`
- **Accent**: `#BC6C25`
- **White**: `#FFFFFF`
- **Gray Light**: `#F3F4F6`
- **Gray Medium**: `#9CA3AF`
- **Gray Dark**: `#374151`

### Typography
- **Headline**: 32px, bold
- **Title**: 20px, bold
- **Body**: 16px, regular
- **Caption**: 14px, regular
- **Small**: 12px, regular

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator / Android Emulator / Web Browser

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd BlueChat

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App
1. **iOS**: Press `i` in the terminal or scan QR code with Expo Go
2. **Android**: Press `a` in the terminal or scan QR code with Expo Go
3. **Web**: Press `w` in the terminal to open in browser

## 📱 User Flow

### 1. Username Entry
- Enter a username (2-20 characters, alphanumeric + underscore)
- Validation ensures proper format
- Creates user profile and initializes Bluetooth node

### 2. Room Discovery
- Automatically scans for nearby Bluetooth devices
- Displays available chat rooms from nearby hosts
- Shows room capacity and member count
- Join rooms that aren't full

### 3. Chat Room
- Real-time messaging with other nearby users
- Messages sent directly via Bluetooth
- Message history loaded from local storage
- Leave room functionality with automatic cleanup

## 🔧 Bluetooth Service

The app includes a comprehensive Bluetooth service that simulates:

- **Bluetooth Mesh Network**: Direct device-to-device connections
- **Proximity Discovery**: Find nearby users via Bluetooth scanning
- **Room Management**: Create, join, and leave rooms via Bluetooth
- **Message Broadcasting**: Send messages to all room members
- **Local Storage**: Persist messages locally until leaving

## 🛠️ Development

### Key Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Zustand**: Lightweight state management
- **Expo Router**: File-based navigation
- **AsyncStorage**: Local data persistence

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Component Architecture**: Reusable, modular components
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🎯 Next Steps

### Potential Enhancements
- **Real Bluetooth Integration**: Replace simulation with actual Bluetooth API
- **Push Notifications**: Notify users of new messages
- **User Profiles**: Add avatars and user preferences
- **Room Creation**: Allow users to create new rooms
- **Message Reactions**: Add emoji reactions to messages
- **File Sharing**: Share images and files via Bluetooth

### Performance Optimizations
- **Message Pagination**: Load messages in chunks
- **Image Optimization**: Compress and cache images
- **Offline Support**: Enhanced offline capabilities
- **Background Sync**: Sync messages when app becomes active

## 📄 License

This project is for portfolio/demo purposes. Feel free to use as a reference for your own projects.

---

**Note**: This is a demo application that simulates Bluetooth functionality. For production use, you would need to implement actual Bluetooth discovery and mesh networking using the appropriate platform APIs.

