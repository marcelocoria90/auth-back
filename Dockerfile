FROM node:22.11.0-slim
WORKDIR /app
COPY . .
RUN npm i
CMD ["npm", "run", "dev"]
