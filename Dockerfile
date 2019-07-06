# Specify a base image
FROM node:lts-alpine

# Install some dependencies
COPY ./package.json .
RUN npm install

# Copy local files
COPY ./ ./

ARG DACKBOT_BOT_TOKEN
ENV DACKBOT_BOT_TOKEN $DACKBOT_BOT_TOKEN

ARG DACKBOT_OWNER_ID
ENV DACKBOT_OWNER_ID $DACKBOT_OWNER_ID

# Set the default command
CMD ["npm", "start"]