# Specify a base image
FROM node:lts-alpine

# Install some dependencies
COPY ./package.json .
RUN npm install

# Copy local files
COPY ./ ./

COPY ./hotpatches/dispatcher.js ./node_modules/discord.js-commando/src/dispatcher.js

ARG DACKBOT_BOT_TOKEN
ENV DACKBOT_BOT_TOKEN $DACKBOT_BOT_TOKEN

ARG DACKBOT_OWNER_ID
ENV DACKBOT_OWNER_ID $DACKBOT_OWNER_ID

ARG SMMRY_API_KEY
ENV SMMRY_API_KEY $SMMRY_API_KEY

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY 

# Set the default command
CMD ["npm", "start"]