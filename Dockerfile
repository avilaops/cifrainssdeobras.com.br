FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY next.config.ts tsconfig.json next-env.d.ts postcss.config.mjs ./
COPY .env.production ./
COPY public ./public
COPY src ./src
# Variável embutida no bundle em build time; vinda como ENV, tem precedência
# sobre qualquer .env.local residual copiado pelo contexto.
ARG NEXT_PUBLIC_CALCULADORA_URL=https://app.cifrainssdeobras.com.br
ENV NEXT_PUBLIC_CALCULADORA_URL=$NEXT_PUBLIC_CALCULADORA_URL
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3000
