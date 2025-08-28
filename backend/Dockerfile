# Use the official Node.js 18 image as a base
FROM node:22.18.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's build cache
COPY package*.json ./

# Install application dependencies inside the container
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]
