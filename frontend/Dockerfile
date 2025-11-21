# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package.json frontend/tsconfig.json frontend/next.config.mjs frontend/tailwind.config.ts frontend/postcss.config.js frontend/next-env.d.ts ./
COPY frontend/src ./src
COPY frontend/public ./public
RUN corepack enable \
    && pnpm install --no-frozen-lockfile \
    && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/public ./public
EXPOSE 3000
CMD ["pnpm", "start"]
