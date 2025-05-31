FROM oven/bun:1.2 as base

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Use a clean image for running
FROM oven/bun:1.2-slim as runtime

WORKDIR /app

# Copy the built application and node_modules
COPY --from=base /app/dist /app/dist
COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/node_modules /app/node_modules

# Run the application
CMD ["bun", "run", "start"]
