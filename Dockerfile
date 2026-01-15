FROM node:23-alpine

WORKDIR /app

COPY . ./

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port 80
EXPOSE 80

# Command will be provided by smithery.yaml
CMD ["node", "dist/index.js"]
