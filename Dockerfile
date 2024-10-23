# Stage 1: Build React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve React app with Nginx
FROM nginx:alpine

# Copy the React build to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy SSL certificate and key (you should replace the paths with your actual cert and key locations)
COPY ./certificate.crt /etc/nginx/ssl/certificate.crt
COPY ./private.key /etc/nginx/ssl/private.key

# Copy Nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 443 for HTTPS
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
