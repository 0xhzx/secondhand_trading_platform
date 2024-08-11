# build stage
FROM library/node:18-alpine as build
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls -al && npm run build

# production stage
FROM library/nginx:stable-alpine
COPY --from=build /home/node/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]