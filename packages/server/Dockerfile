# Production-ready Dockerfile for BlueChat Server
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies for all workspaces (monorepo root)
COPY ../../pnpm-lock.yaml ../../package.json ../../pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy server source code
COPY . .

# Build TypeScript
RUN pnpm --filter "./packages/server..." run build || pnpm run build

# --- Production image ---
FROM node:20-alpine
WORKDIR /app

# Copy only built server and production deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/index.js"]
