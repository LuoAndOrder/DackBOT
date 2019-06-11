# Specify a base image
FROM node:lts-alpine

# Copy local files
COPY ./ ./

# Install some dependencies
RUN npm install

# Set up Environment variables
ARG token
ENV DACKBOT_BOT_TOKEN=$token

# Set the default command
CMD ["npm", "start"]