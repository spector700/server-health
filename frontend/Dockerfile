# Stage 0: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 1: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]