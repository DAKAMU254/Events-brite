# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0
ARG PNPM_VERSION=9.12.3

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app

# Create the directory and grant permissions to the node user
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Switch to non-root user early
USER node

# Copy package files with correct ownership
COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Generate Prisma client
COPY --chown=node:node prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the source files into the image.
COPY --chown=node:node . .

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD ["node", "index.js"]