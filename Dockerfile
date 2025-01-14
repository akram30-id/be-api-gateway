# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install --save-dev nodemon

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run database migrations with Prisma
RUN npx prisma generate

# Start the application
CMD ["npx", "nodemon", "index.js"]