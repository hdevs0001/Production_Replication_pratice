# ====================
# STAGE 1: Build
# ====================

#step1: setting the base image 

FROM node:22-alpine AS builder

#step-2 : Is working directory inside the container 
WORKDIR /app

#step-3 : then we have to copy the package files first 

COPY package*.json ./

# step-4 : Install the dependencies 
RUN npm ci

# step-5 : Copy application source code 
COPY tsconfig*.json ./
COPY src ./src

#step-6 : compile Typescript 
RUN npm run build 

# ===================
# STAGE 2:PRODUCTION
# ===================

FROM node:22-alpine AS production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force 

COPY --from=builder /app/dist ./dist

RUN mkdir -p logs && chown -R appuser:appgroup logs

USER  appuser


# step-7 : Document the port the app use 
EXPOSE 3001 

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health',(res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error',()=> process.exit(1))"

# step-8 : start the applicaton 
CMD [ "node","dist/server.js" ]