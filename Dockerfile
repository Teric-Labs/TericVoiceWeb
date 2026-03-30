# Build stage
FROM node:20-slim as build-stage

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# Set CI=false to prevent warnings from failing the build
ENV CI=false
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build output to Nginx share
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copy custom Nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
