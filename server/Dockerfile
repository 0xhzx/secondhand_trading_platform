# esbuild stage
FROM library/node:18-alpine as esbuild
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# node stage
FROM library/node:18-alpine as node
WORKDIR /home/node/app
COPY --from=esbuild /home/node/app/dist/ ./dist/
COPY --from=esbuild /home/node/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production
RUN npm install passport-custom
ENTRYPOINT [ "node", "dist/server.js" ]
EXPOSE 8191