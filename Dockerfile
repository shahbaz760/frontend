# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the app's source code
COPY . .

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Step 2: Serve the React app using a lightweight web server
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will use
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
