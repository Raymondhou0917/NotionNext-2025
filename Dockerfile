ARG NOTION_PAGE_ID
ARG NEXT_PUBLIC_THEME

FROM node:20-alpine3.18 AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Install build dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
WORKDIR /app

# Copy package files
COPY package*.json ./
# Install dependencies with npm
RUN npm install --legacy-peer-deps

# 2. Rebuild the source code only when needed
FROM base AS builder
ARG NOTION_PAGE_ID
ENV NEXT_BUILD_STANDALONE=true

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 个人仓库把将配置好的.env.local文件放到项目根目录，可自动使用环境变量
# COPY --from=builder /app/.env.local ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# 使用環境變數 PORT，如果未設置則默認使用 8080（Zeabur 的默認端口）
ENV PORT=8080
EXPOSE ${PORT}

CMD ["node", "server.js"]