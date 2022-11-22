FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install 
COPY . . 
RUN npm run build

FROM nginx 
EXPOSE 80 443
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /app/build /usr/share/nginx/html

