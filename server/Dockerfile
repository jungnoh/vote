FROM node:15.3.0

WORKDIR /app
ADD package.json /app
RUN npm install
ADD . /app
CMD ["npm", "run", "serve"]
USER node